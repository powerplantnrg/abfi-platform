/**
 * Unified PageFooter component for consistent footer across the platform.
 */
import { Leaf, Lock, Shield } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export function PageFooter() {
  return (
    <footer className="border-t bg-white text-gray-600 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-[#D4AF37]/20">
                <Leaf className="h-5 w-5 text-[#D4AF37]" />
              </div>
              <span className="text-lg font-bold font-display text-black">
                ABFI
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              Australian Bioenergy Feedstock Institute — Bank-grade
              infrastructure for biomass supply chain management and project
              finance.
            </p>
            <div className="flex gap-3">
              <Badge
                variant="outline"
                className="border-gray-200 text-gray-500 text-xs"
              >
                <Lock className="h-3 w-3 mr-1" />
                SOC 2
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-200 text-gray-500 text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                ISO 27001
              </Badge>
            </div>
          </div>

          {/* For Growers */}
          <div>
            <h3 className="font-semibold mb-4 text-black">For Growers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/producer-registration"
                  className="hover:text-black transition-colors"
                >
                  Register Supply
                </Link>
              </li>
              <li>
                <Link
                  href="/supplier/futures"
                  className="hover:text-black transition-colors"
                >
                  List Futures
                </Link>
              </li>
              <li>
                <Link
                  href="/for-growers"
                  className="hover:text-black transition-colors"
                >
                  Grower Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* For Developers */}
          <div>
            <h3 className="font-semibold mb-4 text-black">For Developers</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/futures"
                  className="hover:text-black transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/bankability"
                  className="hover:text-black transition-colors"
                >
                  Bankability
                </Link>
              </li>
              <li>
                <Link
                  href="/for-developers"
                  className="hover:text-black transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/feedstock-map"
                  className="hover:text-black transition-colors"
                >
                  Supply Map
                </Link>
              </li>
            </ul>
          </div>

          {/* For Lenders */}
          <div>
            <h3 className="font-semibold mb-4 text-black">For Lenders</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/lender-portal"
                  className="hover:text-black transition-colors"
                >
                  Lender Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/compliance-dashboard"
                  className="hover:text-black transition-colors"
                >
                  Compliance
                </Link>
              </li>
              <li>
                <Link
                  href="/for-lenders"
                  className="hover:text-black transition-colors"
                >
                  Risk Framework
                </Link>
              </li>
              <li>
                <Link
                  href="/platform-features"
                  className="hover:text-black transition-colors"
                >
                  Platform Features
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-black0">
            © {new Date().getFullYear()} Australian Bioenergy Feedstock
            Institute. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-black0">
            <Link
              href="/privacy"
              className="hover:text-black transition-colors"
            >
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-black transition-colors">
              Terms
            </Link>
            <Link
              href="/security"
              className="hover:text-black transition-colors"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default PageFooter;
