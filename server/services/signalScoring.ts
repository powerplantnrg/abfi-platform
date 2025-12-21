/**
 * Signal Scoring Service
 * Calculates entity scores based on accumulated signals
 */

import { getDb } from "../db";
import { stealthEntities, stealthSignals } from "../../drizzle/schema";
import { eq, sql, desc, and, gte } from "drizzle-orm";

// Helper to get db instance with null check
async function requireDb() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return db;
}

// Signal type weights for scoring
export const SIGNAL_TYPE_WEIGHTS: Record<string, number> = {
  patent_biofuel_tech: 5.0, // Core biofuel patents
  patent_related_tech: 3.0, // Related technology patents
  permit_fuel_production: 5.0, // Fuel production permits
  permit_industrial: 2.5, // Industrial permits
  environmental_approval: 3.0, // Environmental approvals
  grant_awarded: 6.0, // Government grants (high confidence)
  new_company_biofuel: 4.0, // New company registrations
  company_industry_code: 2.0, // Industry code matches
  company_name_match: 1.5, // Name pattern matches
  location_cluster: 2.0, // Geographic clustering
  keyword_match: 1.0, // General keyword matches
};

// Time decay factors (signals become less relevant over time)
const TIME_DECAY_HALF_LIFE_DAYS = 365; // 1 year half-life

/**
 * Calculate time decay multiplier for a signal
 * More recent signals have higher weight
 */
function calculateTimeDecay(detectedAt: Date): number {
  const now = new Date();
  const daysSince = (now.getTime() - detectedAt.getTime()) / (1000 * 60 * 60 * 24);
  return Math.pow(0.5, daysSince / TIME_DECAY_HALF_LIFE_DAYS);
}

/**
 * Calculate the score for a single entity based on its signals
 */
export async function calculateEntityScore(entityId: number): Promise<number> {
  const db = await requireDb();

  // Get all signals for this entity
  const signals = await db
    .select()
    .from(stealthSignals)
    .where(eq(stealthSignals.entityId, entityId))
    .orderBy(desc(stealthSignals.detectedAt));

  if (signals.length === 0) {
    return 0;
  }

  let totalScore = 0;
  const signalTypeCounts: Record<string, number> = {};

  for (const signal of signals) {
    const baseWeight = SIGNAL_TYPE_WEIGHTS[signal.signalType] || 1.0;
    const signalWeight = parseFloat(signal.signalWeight as unknown as string) || 1.0;
    const confidence = parseFloat(signal.confidence as unknown as string) || 1.0;
    const timeDecay = calculateTimeDecay(signal.detectedAt);

    // Count signal types for diversity bonus
    signalTypeCounts[signal.signalType] =
      (signalTypeCounts[signal.signalType] || 0) + 1;

    // Calculate signal contribution with diminishing returns for same type
    const typeCount = signalTypeCounts[signal.signalType];
    const diminishingFactor = 1 / Math.sqrt(typeCount);

    const signalContribution =
      baseWeight * signalWeight * confidence * timeDecay * diminishingFactor;

    totalScore += signalContribution;
  }

  // Diversity bonus - more signal types = more confidence
  const uniqueSignalTypes = Object.keys(signalTypeCounts).length;
  const diversityBonus = 1 + (uniqueSignalTypes - 1) * 0.1; // 10% bonus per additional type

  // Recency bonus - recent activity is more relevant
  const mostRecentSignal = signals[0];
  const daysSinceRecent =
    (new Date().getTime() - mostRecentSignal.detectedAt.getTime()) /
    (1000 * 60 * 60 * 24);
  const recencyBonus = daysSinceRecent < 30 ? 1.2 : daysSinceRecent < 90 ? 1.1 : 1.0;

  const finalScore = totalScore * diversityBonus * recencyBonus;

  // Normalize to 0-100 scale with logarithmic scaling
  // This prevents any single entity from dominating
  const normalizedScore = Math.min(100, Math.log10(finalScore + 1) * 30);

  return Math.round(normalizedScore * 100) / 100;
}

/**
 * Recalculate scores for all entities
 */
export async function recalculateAllScores(): Promise<{
  updated: number;
  errors: string[];
}> {
  const db = await requireDb();
  let updated = 0;
  const errors: string[] = [];

  // Get all entities
  const entities = await db.select({ id: stealthEntities.id }).from(stealthEntities);

  for (const entity of entities) {
    try {
      const score = await calculateEntityScore(entity.id);

      await db
        .update(stealthEntities)
        .set({
          currentScore: String(score),
          needsReview: score >= 70, // Flag high-scoring entities for review
        })
        .where(eq(stealthEntities.id, entity.id));

      updated++;
    } catch (error) {
      errors.push(
        `Failed to update entity ${entity.id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  return { updated, errors };
}

/**
 * Update score for a single entity (call after new signals are added)
 */
export async function updateEntityScore(entityId: number): Promise<number> {
  const db = await requireDb();
  const score = await calculateEntityScore(entityId);

  await db
    .update(stealthEntities)
    .set({
      currentScore: String(score),
      needsReview: score >= 70,
    })
    .where(eq(stealthEntities.id, entityId));

  return score;
}

/**
 * Get entity scoring breakdown for transparency
 */
export async function getEntityScoringBreakdown(
  entityId: number
): Promise<{
  totalScore: number;
  signalContributions: Array<{
    signalId: number;
    signalType: string;
    title: string;
    baseWeight: number;
    timeDecay: number;
    contribution: number;
  }>;
  diversityBonus: number;
  recencyBonus: number;
}> {
  const db = await requireDb();
  const signals = await db
    .select()
    .from(stealthSignals)
    .where(eq(stealthSignals.entityId, entityId))
    .orderBy(desc(stealthSignals.detectedAt));

  const signalTypeCounts: Record<string, number> = {};
  const contributions: Array<{
    signalId: number;
    signalType: string;
    title: string;
    baseWeight: number;
    timeDecay: number;
    contribution: number;
  }> = [];

  let totalScore = 0;

  for (const signal of signals) {
    const baseWeight = SIGNAL_TYPE_WEIGHTS[signal.signalType] || 1.0;
    const signalWeight = parseFloat(signal.signalWeight as unknown as string) || 1.0;
    const confidence = parseFloat(signal.confidence as unknown as string) || 1.0;
    const timeDecay = calculateTimeDecay(signal.detectedAt);

    signalTypeCounts[signal.signalType] =
      (signalTypeCounts[signal.signalType] || 0) + 1;
    const typeCount = signalTypeCounts[signal.signalType];
    const diminishingFactor = 1 / Math.sqrt(typeCount);

    const contribution =
      baseWeight * signalWeight * confidence * timeDecay * diminishingFactor;
    totalScore += contribution;

    contributions.push({
      signalId: signal.id,
      signalType: signal.signalType,
      title: signal.title,
      baseWeight,
      timeDecay: Math.round(timeDecay * 100) / 100,
      contribution: Math.round(contribution * 100) / 100,
    });
  }

  const uniqueSignalTypes = Object.keys(signalTypeCounts).length;
  const diversityBonus = 1 + (uniqueSignalTypes - 1) * 0.1;

  const mostRecentSignal = signals[0];
  const daysSinceRecent = mostRecentSignal
    ? (new Date().getTime() - mostRecentSignal.detectedAt.getTime()) /
      (1000 * 60 * 60 * 24)
    : 999;
  const recencyBonus = daysSinceRecent < 30 ? 1.2 : daysSinceRecent < 90 ? 1.1 : 1.0;

  return {
    totalScore: Math.round(totalScore * diversityBonus * recencyBonus * 100) / 100,
    signalContributions: contributions,
    diversityBonus: Math.round(diversityBonus * 100) / 100,
    recencyBonus: Math.round(recencyBonus * 100) / 100,
  };
}

/**
 * Get high-scoring entities for the dashboard
 */
export async function getHighScoringEntities(
  limit: number = 20,
  minScore: number = 50
): Promise<
  Array<{
    id: number;
    canonicalName: string;
    entityType: string;
    currentScore: number;
    signalCount: number;
    lastSignalAt: Date | null;
  }>
> {
  const db = await requireDb();
  const entities = await db
    .select({
      id: stealthEntities.id,
      canonicalName: stealthEntities.canonicalName,
      entityType: stealthEntities.entityType,
      currentScore: stealthEntities.currentScore,
      signalCount: stealthEntities.signalCount,
      lastSignalAt: stealthEntities.lastSignalAt,
    })
    .from(stealthEntities)
    .where(gte(stealthEntities.currentScore, String(minScore)))
    .orderBy(desc(stealthEntities.currentScore))
    .limit(limit);

  return entities.map((e) => ({
    ...e,
    currentScore: parseFloat(e.currentScore as unknown as string),
  }));
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<{
  totalEntities: number;
  highScoreEntities: number;
  newSignalsToday: number;
  newSignalsWeek: number;
  topSignalTypes: Array<{ type: string; count: number }>;
}> {
  const db = await requireDb();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Total entities
  const [entityCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(stealthEntities);

  // High score entities (score > 70)
  const [highScoreCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(stealthEntities)
    .where(gte(stealthEntities.currentScore, "70"));

  // New signals today
  const [todaySignals] = await db
    .select({ count: sql<number>`count(*)` })
    .from(stealthSignals)
    .where(gte(stealthSignals.detectedAt, todayStart));

  // New signals this week
  const [weekSignals] = await db
    .select({ count: sql<number>`count(*)` })
    .from(stealthSignals)
    .where(gte(stealthSignals.detectedAt, weekStart));

  // Top signal types
  const signalTypeDistribution = await db
    .select({
      type: stealthSignals.signalType,
      count: sql<number>`count(*)`,
    })
    .from(stealthSignals)
    .groupBy(stealthSignals.signalType)
    .orderBy(desc(sql`count(*)`))
    .limit(5);

  return {
    totalEntities: entityCount.count,
    highScoreEntities: highScoreCount.count,
    newSignalsToday: todaySignals.count,
    newSignalsWeek: weekSignals.count,
    topSignalTypes: signalTypeDistribution,
  };
}
