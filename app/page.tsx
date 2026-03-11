import TopBar from "@/components/dashboard/TopBar";
import KoreaMap from "@/components/dashboard/KoreaMap";
import CrisisReports from "@/components/dashboard/CrisisReports";
import CategoryGauges from "@/components/dashboard/CategoryGauges";
import WaveTimeline from "@/components/dashboard/WaveTimeline";
import ContagionNetwork from "@/components/dashboard/ContagionNetwork";
import CrisisSimulator from "@/components/dashboard/CrisisSimulator";
import LeadingIndicatorChart from "@/components/dashboard/LeadingIndicatorChart";
import InsightCards from "@/components/dashboard/InsightCards";
import { mockRiskScore } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero: Overall Risk Score */}
      <TopBar data={mockRiskScore} />

      {/* Category Gauges */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">카테고리별 위험도</h2>
        <CategoryGauges data={mockRiskScore} />
      </section>

      {/* Leading Indicator Chart */}
      <LeadingIndicatorChart />

      {/* AI Insight Cards */}
      <InsightCards />

      {/* Map + Crisis Reports */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">실시간 현황</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <KoreaMap />
          <CrisisReports />
        </div>
      </section>

      {/* Wave Timeline */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">파동 분석</h2>
        <WaveTimeline />
      </section>

      {/* Contagion Network + Crisis Simulator */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">심층 분석</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ContagionNetwork />
          <CrisisSimulator />
        </div>
      </section>
    </div>
  );
}
