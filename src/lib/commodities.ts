// ABFI Commodity Markets Data
// Comprehensive list of tradeable commodities, instruments, and market information

export type MarketDemand = "Very High" | "High" | "Moderate" | "Low" | "Emerging";

export interface Commodity {
  id: string;
  name: string;
  unit: string;
  useCase: string;
  marketDemand: MarketDemand;
  category: string;
  subcategory: string;
}

export interface ProcessedProduct {
  id: string;
  name: string;
  unit: string;
  specification: string;
  market: string;
  category: string;
  subcategory: string;
}

export interface CarbonInstrument {
  id: string;
  name: string;
  unit: string;
  scheme: string;
  market: string;
  category: string;
  subcategory: string;
}

export interface FinancialInstrument {
  id: string;
  name: string;
  type: string;
  structure: string;
  useCase: string;
  category: string;
  subcategory: string;
}

export interface PriceIndex {
  id: string;
  name: string;
  composition: string;
  publication: string;
}

// ============================================
// PRIMARY FEEDSTOCK CATEGORIES
// ============================================

export const oilseedCrops: Commodity[] = [
  { id: "canola-hefa", name: "Canola (HEFA-grade)", unit: "tonne", useCase: "SAF, renewable diesel", marketDemand: "Very High", category: "feedstock", subcategory: "oilseed" },
  { id: "canola-industrial", name: "Canola (industrial)", unit: "tonne", useCase: "Biodiesel, oleochemicals", marketDemand: "High", category: "feedstock", subcategory: "oilseed" },
  { id: "camelina", name: "Camelina", unit: "tonne", useCase: "SAF (low CI advantage)", marketDemand: "Emerging", category: "feedstock", subcategory: "oilseed" },
  { id: "mustard-seed", name: "Mustard seed", unit: "tonne", useCase: "Biodiesel", marketDemand: "Moderate", category: "feedstock", subcategory: "oilseed" },
  { id: "safflower", name: "Safflower", unit: "tonne", useCase: "Biodiesel, lubricants", marketDemand: "Moderate", category: "feedstock", subcategory: "oilseed" },
  { id: "pongamia", name: "Pongamia", unit: "tonne", useCase: "SAF, biodiesel (non-food)", marketDemand: "Emerging", category: "feedstock", subcategory: "oilseed" },
  { id: "hemp-seed", name: "Hemp seed", unit: "tonne", useCase: "Biofuel, industrial oils", marketDemand: "Emerging", category: "feedstock", subcategory: "oilseed" },
  { id: "cotton-seed", name: "Cotton seed", unit: "tonne", useCase: "Biodiesel", marketDemand: "High", category: "feedstock", subcategory: "oilseed" },
  { id: "sunflower", name: "Sunflower", unit: "tonne", useCase: "Biodiesel", marketDemand: "Moderate", category: "feedstock", subcategory: "oilseed" },
];

export const sugarStarchCrops: Commodity[] = [
  { id: "sugarcane-whole", name: "Sugarcane (whole)", unit: "tonne", useCase: "Ethanol, biogas", marketDemand: "Very High", category: "feedstock", subcategory: "sugar-starch" },
  { id: "molasses", name: "Molasses", unit: "tonne", useCase: "Ethanol fermentation", marketDemand: "Very High", category: "feedstock", subcategory: "sugar-starch" },
  { id: "sorghum-grain", name: "Sorghum (grain)", unit: "tonne", useCase: "Ethanol, biogas", marketDemand: "High", category: "feedstock", subcategory: "sugar-starch" },
  { id: "sorghum-sweet", name: "Sorghum (sweet)", unit: "tonne", useCase: "Direct fermentation", marketDemand: "Moderate", category: "feedstock", subcategory: "sugar-starch" },
  { id: "wheat-feed", name: "Wheat (feed grade)", unit: "tonne", useCase: "Ethanol", marketDemand: "Moderate", category: "feedstock", subcategory: "sugar-starch" },
  { id: "barley-feed", name: "Barley (feed grade)", unit: "tonne", useCase: "Ethanol", marketDemand: "Moderate", category: "feedstock", subcategory: "sugar-starch" },
  { id: "corn-maize", name: "Corn/Maize", unit: "tonne", useCase: "Ethanol", marketDemand: "Moderate", category: "feedstock", subcategory: "sugar-starch" },
  { id: "cassava", name: "Cassava", unit: "tonne", useCase: "Ethanol (tropical)", marketDemand: "Low", category: "feedstock", subcategory: "sugar-starch" },
];

export const lignocellulosicBiomass: Commodity[] = [
  { id: "bagasse", name: "Bagasse", unit: "tonne", useCase: "Cogen, cellulosic ethanol, biochar", marketDemand: "Very High", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "wheat-straw", name: "Wheat straw", unit: "tonne/bale", useCase: "Biogas, pyrolysis, pellets", marketDemand: "High", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "barley-straw", name: "Barley straw", unit: "tonne/bale", useCase: "Biogas, pyrolysis", marketDemand: "High", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "canola-straw", name: "Canola straw", unit: "tonne/bale", useCase: "Biogas, pyrolysis", marketDemand: "Moderate", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "rice-husks", name: "Rice husks", unit: "tonne", useCase: "Gasification, biochar", marketDemand: "Moderate", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "rice-straw", name: "Rice straw", unit: "tonne", useCase: "Biogas, pyrolysis", marketDemand: "Moderate", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "cotton-gin-trash", name: "Cotton gin trash", unit: "tonne", useCase: "Pellets, biogas", marketDemand: "Moderate", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "corn-stover", name: "Corn stover", unit: "tonne", useCase: "Cellulosic ethanol, biogas", marketDemand: "Moderate", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "bamboo", name: "Bamboo", unit: "tonne", useCase: "Pyrolysis, gasification, biochar", marketDemand: "Emerging", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "giant-king-grass", name: "Giant King Grass", unit: "tonne", useCase: "Biogas, pellets", marketDemand: "Emerging", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "miscanthus", name: "Miscanthus", unit: "tonne", useCase: "Pellets, pyrolysis", marketDemand: "Emerging", category: "feedstock", subcategory: "lignocellulosic" },
  { id: "hemp-hurds", name: "Hemp hurds/stalks", unit: "tonne", useCase: "Biochar, insulation, biogas", marketDemand: "Emerging", category: "feedstock", subcategory: "lignocellulosic" },
];

export const forestryWoodProducts: Commodity[] = [
  { id: "sawmill-residues", name: "Sawmill residues", unit: "tonne", useCase: "Pellets, pyrolysis, cogen", marketDemand: "High", category: "feedstock", subcategory: "forestry" },
  { id: "plantation-thinnings", name: "Plantation thinnings", unit: "tonne", useCase: "Pellets, chips", marketDemand: "Moderate", category: "feedstock", subcategory: "forestry" },
  { id: "pulpwood", name: "Pulpwood (low grade)", unit: "tonne", useCase: "Pellets, biochar", marketDemand: "Moderate", category: "feedstock", subcategory: "forestry" },
  { id: "wood-chips-hardwood", name: "Wood chips (hardwood)", unit: "tonne", useCase: "Gasification, pellets", marketDemand: "High", category: "feedstock", subcategory: "forestry" },
  { id: "wood-chips-softwood", name: "Wood chips (softwood)", unit: "tonne", useCase: "Pellets, cogen", marketDemand: "High", category: "feedstock", subcategory: "forestry" },
  { id: "bark", name: "Bark", unit: "tonne", useCase: "Mulch, biochar, boiler fuel", marketDemand: "Moderate", category: "feedstock", subcategory: "forestry" },
  { id: "sawdust", name: "Sawdust", unit: "tonne", useCase: "Pellets, briquettes", marketDemand: "High", category: "feedstock", subcategory: "forestry" },
  { id: "forest-slash", name: "Forest slash", unit: "tonne", useCase: "Biomass power", marketDemand: "Moderate", category: "feedstock", subcategory: "forestry" },
];

export const animalFatsRendering: Commodity[] = [
  { id: "tallow-cat1", name: "Tallow (Category 1)", unit: "tonne", useCase: "Industrial, limited biofuel", marketDemand: "Low", category: "feedstock", subcategory: "animal-fats" },
  { id: "tallow-cat2", name: "Tallow (Category 2)", unit: "tonne", useCase: "Biodiesel, oleochemicals", marketDemand: "High", category: "feedstock", subcategory: "animal-fats" },
  { id: "tallow-cat3", name: "Tallow (Category 3/edible)", unit: "tonne", useCase: "Premium biodiesel, SAF", marketDemand: "Very High", category: "feedstock", subcategory: "animal-fats" },
  { id: "poultry-fat", name: "Poultry fat", unit: "tonne", useCase: "Biodiesel", marketDemand: "Moderate", category: "feedstock", subcategory: "animal-fats" },
  { id: "pork-lard", name: "Pork lard", unit: "tonne", useCase: "Biodiesel", marketDemand: "Moderate", category: "feedstock", subcategory: "animal-fats" },
  { id: "fish-oil", name: "Fish oil (industrial)", unit: "tonne", useCase: "Biodiesel, omega", marketDemand: "Moderate", category: "feedstock", subcategory: "animal-fats" },
  { id: "meat-bone-meal", name: "Meat and bone meal", unit: "tonne", useCase: "Gasification, fertiliser", marketDemand: "Moderate", category: "feedstock", subcategory: "animal-fats" },
];

export const usedCookingOilWaste: Commodity[] = [
  { id: "uco-restaurant", name: "UCO (restaurant collection)", unit: "litre/tonne", useCase: "Biodiesel, SAF (HEFA)", marketDemand: "Very High", category: "feedstock", subcategory: "uco" },
  { id: "uco-industrial", name: "UCO (industrial food proc)", unit: "tonne", useCase: "Biodiesel, SAF", marketDemand: "Very High", category: "feedstock", subcategory: "uco" },
  { id: "trap-grease", name: "Trap grease", unit: "tonne", useCase: "Biogas, low-grade biodiesel", marketDemand: "Moderate", category: "feedstock", subcategory: "uco" },
  { id: "industrial-waste-oils", name: "Industrial waste oils", unit: "tonne", useCase: "Re-refining, fuel", marketDemand: "Low", category: "feedstock", subcategory: "uco" },
];

export const organicWasteStreams: Commodity[] = [
  { id: "food-processing-waste", name: "Food processing waste", unit: "tonne", useCase: "Biogas, composting", marketDemand: "High", category: "feedstock", subcategory: "organic-waste" },
  { id: "fruit-veg-waste", name: "Fruit & vegetable waste", unit: "tonne", useCase: "Biogas, ethanol", marketDemand: "Moderate", category: "feedstock", subcategory: "organic-waste" },
  { id: "dairy-processing-waste", name: "Dairy processing waste", unit: "tonne", useCase: "Biogas", marketDemand: "High", category: "feedstock", subcategory: "organic-waste" },
  { id: "brewery-distillery-waste", name: "Brewery/distillery waste", unit: "tonne", useCase: "Biogas, animal feed", marketDemand: "High", category: "feedstock", subcategory: "organic-waste" },
  { id: "abattoir-waste", name: "Abattoir waste", unit: "tonne", useCase: "Biogas, rendering", marketDemand: "High", category: "feedstock", subcategory: "organic-waste" },
  { id: "chicken-litter", name: "Chicken litter", unit: "tonne", useCase: "Biogas, pyrolysis, fertiliser", marketDemand: "High", category: "feedstock", subcategory: "organic-waste" },
  { id: "pig-manure", name: "Pig manure (slurry)", unit: "m³", useCase: "Biogas", marketDemand: "High", category: "feedstock", subcategory: "organic-waste" },
  { id: "cattle-manure", name: "Cattle manure", unit: "tonne", useCase: "Biogas, composting", marketDemand: "Moderate", category: "feedstock", subcategory: "organic-waste" },
  { id: "feedlot-waste", name: "Feedlot waste", unit: "tonne", useCase: "Biogas", marketDemand: "High", category: "feedstock", subcategory: "organic-waste" },
  { id: "paunch", name: "Paunch (rumen contents)", unit: "tonne", useCase: "Biogas", marketDemand: "Moderate", category: "feedstock", subcategory: "organic-waste" },
  { id: "blood-meal", name: "Blood meal", unit: "tonne", useCase: "Fertiliser, biogas", marketDemand: "Moderate", category: "feedstock", subcategory: "organic-waste" },
];

export const municipalCommercialWaste: Commodity[] = [
  { id: "fogo", name: "FOGO (food organics, garden organics)", unit: "tonne", useCase: "Biogas, composting", marketDemand: "Very High", category: "feedstock", subcategory: "municipal" },
  { id: "green-waste", name: "Green waste", unit: "tonne", useCase: "Composting, mulch, biochar", marketDemand: "High", category: "feedstock", subcategory: "municipal" },
  { id: "biosolids", name: "Biosolids (sewage sludge)", unit: "tonne dry", useCase: "Biogas, pyrolysis", marketDemand: "High", category: "feedstock", subcategory: "municipal" },
  { id: "paper-cardboard-contaminated", name: "Paper/cardboard (contaminated)", unit: "tonne", useCase: "Gasification", marketDemand: "Low", category: "feedstock", subcategory: "municipal" },
  { id: "timber-pallets-waste", name: "Timber pallets (waste)", unit: "tonne", useCase: "Chipping, fuel", marketDemand: "Moderate", category: "feedstock", subcategory: "municipal" },
];

// ============================================
// PROCESSED INTERMEDIATES
// ============================================

export const solidBiofuels: ProcessedProduct[] = [
  { id: "wood-pellets-industrial", name: "Wood pellets (industrial)", unit: "tonne", specification: "ENplus A1/A2", market: "Export, domestic power", category: "processed", subcategory: "solid-biofuels" },
  { id: "wood-pellets-residential", name: "Wood pellets (residential)", unit: "tonne", specification: "ENplus A1", market: "Domestic heating", category: "processed", subcategory: "solid-biofuels" },
  { id: "agri-pellets", name: "Agri-pellets (straw)", unit: "tonne", specification: "ISO 17225-6", market: "Industrial heat", category: "processed", subcategory: "solid-biofuels" },
  { id: "torrefied-pellets", name: "Torrefied pellets", unit: "tonne", specification: ">21 MJ/kg", market: "Coal co-firing", category: "processed", subcategory: "solid-biofuels" },
  { id: "briquettes", name: "Briquettes", unit: "tonne", specification: "Various", market: "Industrial, export", category: "processed", subcategory: "solid-biofuels" },
  { id: "biomass-chips-spec", name: "Biomass chips (spec)", unit: "tonne", specification: "Size graded", market: "Power stations", category: "processed", subcategory: "solid-biofuels" },
];

export const biocharCarbonProducts: ProcessedProduct[] = [
  { id: "agricultural-biochar", name: "Agricultural biochar", unit: "tonne", specification: "pH, CEC, carbon %", market: "Soil amendment", category: "processed", subcategory: "biochar" },
  { id: "horticultural-biochar", name: "Horticultural biochar", unit: "m³", specification: "Fine grade, washed", market: "Potting mix", category: "processed", subcategory: "biochar" },
  { id: "industrial-biochar", name: "Industrial biochar", unit: "tonne", specification: "High carbon, low ash", market: "Carbon black substitute", category: "processed", subcategory: "biochar" },
  { id: "activated-carbon", name: "Activated carbon", unit: "tonne", specification: "Surface area spec", market: "Water treatment, industrial", category: "processed", subcategory: "biochar" },
  { id: "carbon-black-bio", name: "Carbon black (bio-based)", unit: "tonne", specification: "Particle size spec", market: "Rubber, plastics", category: "processed", subcategory: "biochar" },
  { id: "graphite-precursor", name: "Graphite precursor", unit: "tonne", specification: "Purity spec", market: "Battery anode", category: "processed", subcategory: "biochar" },
];

export const liquidIntermediates: ProcessedProduct[] = [
  { id: "bio-crude", name: "Bio-crude (pyrolysis oil)", unit: "tonne", specification: "Moisture, TAN, viscosity", market: "Refinery co-processing", category: "processed", subcategory: "liquid" },
  { id: "crude-vegetable-oil", name: "Crude vegetable oil", unit: "tonne", specification: "FFA, moisture", market: "Biodiesel feedstock", category: "processed", subcategory: "liquid" },
  { id: "degummed-vegetable-oil", name: "Degummed vegetable oil", unit: "tonne", specification: "Phosphorus spec", market: "HEFA feedstock", category: "processed", subcategory: "liquid" },
  { id: "crude-glycerine", name: "Crude glycerine", unit: "tonne", specification: "Glycerol content", market: "Biogas, industrial", category: "processed", subcategory: "liquid" },
  { id: "refined-glycerine", name: "Refined glycerine", unit: "tonne", specification: ">99% purity", market: "Pharma, cosmetics", category: "processed", subcategory: "liquid" },
  { id: "bio-methanol", name: "Bio-methanol", unit: "tonne", specification: "Purity", market: "Chemical feedstock", category: "processed", subcategory: "liquid" },
];

export const gaseousProducts: ProcessedProduct[] = [
  { id: "raw-biogas", name: "Raw biogas", unit: "m³/GJ", specification: "CH4 content", market: "On-site power", category: "processed", subcategory: "gaseous" },
  { id: "biomethane-rng", name: "Biomethane (RNG)", unit: "GJ", specification: "Pipeline spec", market: "Gas grid injection", category: "processed", subcategory: "gaseous" },
  { id: "bio-hydrogen", name: "Bio-hydrogen", unit: "kg", specification: "Purity", market: "Transport, industrial", category: "processed", subcategory: "gaseous" },
  { id: "syngas", name: "Syngas", unit: "m³", specification: "CO:H2 ratio", market: "Power, chemicals", category: "processed", subcategory: "gaseous" },
  { id: "bio-co2-food", name: "Bio-CO2 (food grade)", unit: "tonne", specification: "Purity >99.9%", market: "Beverage, food processing", category: "processed", subcategory: "gaseous" },
  { id: "bio-co2-industrial", name: "Bio-CO2 (industrial)", unit: "tonne", specification: "Standard purity", market: "Welding, greenhouses", category: "processed", subcategory: "gaseous" },
];

// ============================================
// ENVIRONMENTAL & CARBON PRODUCTS
// ============================================

export const carbonCredits: CarbonInstrument[] = [
  { id: "accu-vegetation", name: "ACCUs (vegetation)", unit: "tonne CO2e", scheme: "ERF/Safeguard", market: "Compliance, voluntary", category: "carbon", subcategory: "credits" },
  { id: "accu-soil-carbon", name: "ACCUs (soil carbon)", unit: "tonne CO2e", scheme: "ERF/Safeguard", market: "Compliance, voluntary", category: "carbon", subcategory: "credits" },
  { id: "accu-savanna", name: "ACCUs (savanna burning)", unit: "tonne CO2e", scheme: "ERF/Safeguard", market: "Compliance, voluntary", category: "carbon", subcategory: "credits" },
  { id: "accu-landfill", name: "ACCUs (landfill gas)", unit: "tonne CO2e", scheme: "ERF/Safeguard", market: "Compliance, voluntary", category: "carbon", subcategory: "credits" },
  { id: "biochar-carbon-credits", name: "Biochar carbon credits", unit: "tonne CO2e", scheme: "Puro.earth, Verra", market: "Voluntary (premium)", category: "carbon", subcategory: "credits" },
  { id: "verra-vcus", name: "Verra VCUs", unit: "tonne CO2e", scheme: "VCS", market: "International voluntary", category: "carbon", subcategory: "credits" },
  { id: "gold-standard-cers", name: "Gold Standard CERs", unit: "tonne CO2e", scheme: "GS", market: "International voluntary", category: "carbon", subcategory: "credits" },
  { id: "iscc-credits", name: "ISCC credits", unit: "tonne CO2e", scheme: "ISCC", market: "EU compliance", category: "carbon", subcategory: "credits" },
];

export const renewableEnergyCertificates: CarbonInstrument[] = [
  { id: "lgcs", name: "LGCs (Large-scale Gen Certificates)", unit: "MWh", scheme: "RET", market: "Compliance", category: "carbon", subcategory: "recs" },
  { id: "stcs", name: "STCs (Small-scale Tech Certificates)", unit: "MWh", scheme: "RET", market: "Compliance", category: "carbon", subcategory: "recs" },
  { id: "greenpower", name: "GreenPower certificates", unit: "MWh", scheme: "GreenPower", market: "Voluntary", category: "carbon", subcategory: "recs" },
  { id: "go-certificates", name: "Guarantee of Origin certificates", unit: "MWh/kg H2", scheme: "GO Scheme", market: "Export, premium", category: "carbon", subcategory: "recs" },
  { id: "i-recs", name: "I-RECs", unit: "MWh", scheme: "I-REC Standard", market: "International", category: "carbon", subcategory: "recs" },
];

export const sustainabilityCertificates: CarbonInstrument[] = [
  { id: "iscc-eu", name: "ISCC EU certificate", unit: "Feedstock", scheme: "EU RED II", market: "Export premium", category: "carbon", subcategory: "sustainability" },
  { id: "iscc-plus", name: "ISCC PLUS certificate", unit: "Feedstock", scheme: "Global supply chains", market: "Premium pricing", category: "carbon", subcategory: "sustainability" },
  { id: "iscc-corsia", name: "ISCC CORSIA certificate", unit: "SAF feedstock", scheme: "Aviation", market: "Premium pricing", category: "carbon", subcategory: "sustainability" },
  { id: "rsb", name: "RSB certificate", unit: "Feedstock", scheme: "Global", market: "Premium pricing", category: "carbon", subcategory: "sustainability" },
  { id: "bonsucro", name: "Bonsucro certificate", unit: "Sugarcane", scheme: "Global", market: "Premium pricing", category: "carbon", subcategory: "sustainability" },
  { id: "fsc-pefc", name: "FSC/PEFC certificate", unit: "Wood products", scheme: "Global", market: "Market access", category: "carbon", subcategory: "sustainability" },
];

// ============================================
// FINANCIAL INSTRUMENTS
// ============================================

export const forwardContracts: FinancialInstrument[] = [
  { id: "physical-forward-feedstock", name: "Physical forward (feedstock)", type: "Forward", structure: "Physical delivery", useCase: "Lock in price, guarantee supply", category: "financial", subcategory: "forwards" },
  { id: "physical-forward-carbon", name: "Physical forward (carbon)", type: "Forward", structure: "ACCU delivery", useCase: "Carbon price hedging", category: "financial", subcategory: "forwards" },
  { id: "cash-settled-forward", name: "Cash-settled forward", type: "Forward", structure: "Financial settlement", useCase: "Price risk management", category: "financial", subcategory: "forwards" },
  { id: "basis-contract", name: "Basis contract", type: "Forward", structure: "Price differential", useCase: "Location/quality hedging", category: "financial", subcategory: "forwards" },
];

export const optionContracts: FinancialInstrument[] = [
  { id: "call-option-feedstock", name: "Call option (feedstock)", type: "Option", structure: "Right to buy at strike", useCase: "Buyer price protection", category: "financial", subcategory: "options" },
  { id: "put-option-feedstock", name: "Put option (feedstock)", type: "Option", structure: "Right to sell at strike", useCase: "Grower floor price", category: "financial", subcategory: "options" },
  { id: "collar-feedstock", name: "Collar (feedstock)", type: "Option", structure: "Put + sold call", useCase: "Bounded price range", category: "financial", subcategory: "options" },
  { id: "carbon-call-option", name: "Carbon call option", type: "Option", structure: "Right to buy ACCUs", useCase: "Carbon price cap", category: "financial", subcategory: "options" },
];

export const swapAgreements: FinancialInstrument[] = [
  { id: "fixed-floating-feedstock", name: "Fixed-for-floating (feedstock)", type: "Swap", structure: "Exchange price exposure", useCase: "Price certainty", category: "financial", subcategory: "swaps" },
  { id: "commodity-for-commodity", name: "Commodity-for-commodity", type: "Swap", structure: "Exchange different feedstocks", useCase: "Feedstock substitution", category: "financial", subcategory: "swaps" },
  { id: "carbon-for-carbon", name: "Carbon-for-carbon", type: "Swap", structure: "Exchange credit types", useCase: "Portfolio optimisation", category: "financial", subcategory: "swaps" },
];

// ============================================
// PRICE INDICES
// ============================================

export const priceIndices: PriceIndex[] = [
  { id: "abfi-canola", name: "ABFI Canola (Biofuel)", composition: "Delivered QLD/NSW terminals", publication: "Weekly" },
  { id: "abfi-tallow", name: "ABFI Tallow (Cat 3)", composition: "FOB Australia", publication: "Weekly" },
  { id: "abfi-uco", name: "ABFI UCO", composition: "Collected metro", publication: "Weekly" },
  { id: "abfi-bagasse", name: "ABFI Bagasse", composition: "Mill gate QLD", publication: "Seasonal" },
  { id: "abfi-wood-pellets", name: "ABFI Wood Pellets", composition: "FOB export", publication: "Monthly" },
  { id: "abfi-biochar", name: "ABFI Biochar", composition: "Delivered farm", publication: "Monthly" },
  { id: "abfi-rng", name: "ABFI RNG", composition: "$/GJ pipeline", publication: "Monthly" },
  { id: "abfi-saf-composite", name: "ABFI SAF Feedstock Composite", composition: "Weighted basket", publication: "Weekly" },
];

// ============================================
// CATEGORY METADATA
// ============================================

export const feedstockCategories = [
  { id: "oilseed", name: "Oilseed Crops", icon: "Wheat", description: "Seeds and crops for oil extraction" },
  { id: "sugar-starch", name: "Sugar & Starch Crops", icon: "Sprout", description: "Crops for fermentation and ethanol" },
  { id: "lignocellulosic", name: "Lignocellulosic Biomass", icon: "Leaf", description: "Agricultural residues and energy crops" },
  { id: "forestry", name: "Forestry & Wood Products", icon: "TreePine", description: "Wood and forestry residues" },
  { id: "animal-fats", name: "Animal Fats & Rendering", icon: "Beef", description: "Tallow and animal-derived fats" },
  { id: "uco", name: "Used Cooking Oil & Waste Oils", icon: "Droplet", description: "Recycled oils and greases" },
  { id: "organic-waste", name: "Organic Waste Streams", icon: "Recycle", description: "Food and agricultural waste" },
  { id: "municipal", name: "Municipal & Commercial Waste", icon: "Trash2", description: "Urban organic waste streams" },
];

export const processedCategories = [
  { id: "solid-biofuels", name: "Solid Biofuels", icon: "Flame", description: "Pellets, briquettes, and chips" },
  { id: "biochar", name: "Biochar & Carbon Products", icon: "Circle", description: "Carbonized products" },
  { id: "liquid", name: "Liquid Intermediates", icon: "Beaker", description: "Bio-oils and liquid products" },
  { id: "gaseous", name: "Gaseous Products", icon: "Wind", description: "Biogas, RNG, and hydrogen" },
];

export const carbonCategories = [
  { id: "credits", name: "Carbon Credits & Offsets", icon: "BadgeCheck", description: "Compliance and voluntary credits" },
  { id: "recs", name: "Renewable Energy Certificates", icon: "Zap", description: "LGCs, STCs, and international RECs" },
  { id: "sustainability", name: "Sustainability Certificates", icon: "Award", description: "ISCC, RSB, and other certifications" },
];

export const financialCategories = [
  { id: "forwards", name: "Forward Contracts", icon: "ArrowRight", description: "Physical and cash-settled forwards" },
  { id: "options", name: "Options", icon: "GitBranch", description: "Calls, puts, and collars" },
  { id: "swaps", name: "Swap Agreements", icon: "RefreshCw", description: "Price and commodity swaps" },
];

// Helper to get all feedstock commodities
export function getAllFeedstocks(): Commodity[] {
  return [
    ...oilseedCrops,
    ...sugarStarchCrops,
    ...lignocellulosicBiomass,
    ...forestryWoodProducts,
    ...animalFatsRendering,
    ...usedCookingOilWaste,
    ...organicWasteStreams,
    ...municipalCommercialWaste,
  ];
}

// Helper to get all processed products
export function getAllProcessedProducts(): ProcessedProduct[] {
  return [
    ...solidBiofuels,
    ...biocharCarbonProducts,
    ...liquidIntermediates,
    ...gaseousProducts,
  ];
}

// Helper to get all carbon instruments
export function getAllCarbonInstruments(): CarbonInstrument[] {
  return [
    ...carbonCredits,
    ...renewableEnergyCertificates,
    ...sustainabilityCertificates,
  ];
}

// Helper to get all financial instruments
export function getAllFinancialInstruments(): FinancialInstrument[] {
  return [
    ...forwardContracts,
    ...optionContracts,
    ...swapAgreements,
  ];
}

// Market demand color mapping
export function getMarketDemandColor(demand: MarketDemand): string {
  switch (demand) {
    case "Very High":
      return "bg-green-500";
    case "High":
      return "bg-green-400";
    case "Moderate":
      return "bg-yellow-500";
    case "Low":
      return "bg-gray-400";
    case "Emerging":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
}

export function getMarketDemandBadgeVariant(demand: MarketDemand): "default" | "secondary" | "destructive" | "outline" {
  switch (demand) {
    case "Very High":
    case "High":
      return "default";
    case "Moderate":
      return "secondary";
    case "Low":
      return "outline";
    case "Emerging":
      return "default";
    default:
      return "outline";
  }
}
