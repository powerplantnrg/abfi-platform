import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarketsClient } from "./client";

export const metadata = {
  title: "Commodity Markets | ABFI",
  description: "Browse and signal interest in bioenergy feedstocks and commodities",
};

export default async function MarketsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/dashboard");
  }

  // Get buyer data if buyer role
  let buyerId: string | undefined;
  if (profile.role === "buyer") {
    const { data: buyer } = await supabase
      .from("buyers")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    buyerId = buyer?.id;
  }

  // Get supplier data if supplier role
  let supplierId: string | undefined;
  if (profile.role === "supplier") {
    const { data: supplier } = await supabase
      .from("suppliers")
      .select("id")
      .eq("profile_id", user.id)
      .single();
    supplierId = supplier?.id;
  }

  // Get existing market signals for this user
  const { data: signals } = await supabase
    .from("market_signals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container max-w-7xl py-8">
      <MarketsClient
        userRole={profile.role}
        userId={user.id}
        buyerId={buyerId}
        supplierId={supplierId}
        existingSignals={signals || []}
      />
    </div>
  );
}
