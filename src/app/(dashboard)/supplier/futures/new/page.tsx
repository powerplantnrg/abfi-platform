import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FuturesWizard } from "./wizard";

export const metadata = {
  title: "New Futures Listing",
};

export default async function NewFuturesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get supplier
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (!supplier) {
    redirect("/supplier/settings");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Futures Listing</h1>
        <p className="text-muted-foreground">
          Create a long-term supply projection for perennial crops
        </p>
      </div>

      <FuturesWizard supplierId={supplier.id} />
    </div>
  );
}
