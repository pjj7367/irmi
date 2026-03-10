import TopBar from "@/components/dashboard/TopBar";
import KoreaMap from "@/components/dashboard/KoreaMap";
import CrisisReports from "@/components/dashboard/CrisisReports";
import CategoryGauges from "@/components/dashboard/CategoryGauges";
import { mockRiskScore } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="space-y-4">
      {/* Top Bar - Overall Risk Score */}
      <TopBar data={mockRiskScore} />

      {/* Middle Section - Map + Crisis Reports */}
      <div className="grid gap-4 lg:grid-cols-2">
        <KoreaMap />
        <CrisisReports />
      </div>

      {/* Bottom Bar - Category Gauges */}
      <CategoryGauges data={mockRiskScore} />
    </div>
  );
}
