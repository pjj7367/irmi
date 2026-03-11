import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const LABELS: Record<string, string> = {
  employment: "고용",
  finance: "금융",
  prices: "물가",
  realEstate: "부동산",
  selfEmployed: "자영업",
};

interface ReporterRow {
  writer: string;
  total: number;
  primary_cat: string;
  primary_count: number;
  cat_count: number;
}

interface WeeklyRow {
  writer: string;
  week_num: string;
  cnt: number;
}

interface RecentRow {
  writer: string;
  recent: number;
}

interface BeatRow {
  writer: string;
  category: string;
  cnt: number;
}

interface ConvBeatRow {
  topic: string;
  category: string;
  cnt: number;
}

interface ConvReporterRow {
  topic: string;
  writer: string;
  category: string;
  cnt: number;
}

export async function GET() {
  const db = getDb();

  const maxDate = (db.prepare("SELECT MAX(date(published_at)) as d FROM articles").get() as { d: string }).d;

  // 1. Reporter profiles: top reporters by article count with primary beat
  const reporters = db.prepare(`
    WITH writer_totals AS (
      SELECT writer, COUNT(*) as total
      FROM articles
      WHERE writer IS NOT NULL AND writer != ''
      GROUP BY writer
      HAVING total >= 20
      ORDER BY total DESC
      LIMIT 50
    ),
    writer_cats AS (
      SELECT a.writer, a.category, COUNT(*) as cat_cnt,
        ROW_NUMBER() OVER (PARTITION BY a.writer ORDER BY COUNT(*) DESC) as rn
      FROM articles a
      INNER JOIN writer_totals wt ON a.writer = wt.writer
      GROUP BY a.writer, a.category
    ),
    writer_cat_counts AS (
      SELECT writer, COUNT(*) as cat_count
      FROM writer_cats
      GROUP BY writer
    )
    SELECT wt.writer, wt.total,
      wc.category as primary_cat, wc.cat_cnt as primary_count, wcc.cat_count
    FROM writer_totals wt
    LEFT JOIN writer_cats wc ON wt.writer = wc.writer AND wc.rn = 1
    LEFT JOIN writer_cat_counts wcc ON wt.writer = wcc.writer
    ORDER BY wt.total DESC
  `).all() as ReporterRow[];

  // 2. Recent week activity for surge detection
  const recentActivity = db.prepare(`
    SELECT writer, COUNT(*) as recent
    FROM articles
    WHERE published_at >= date(?, '-6 days')
      AND writer IS NOT NULL AND writer != ''
    GROUP BY writer
    ORDER BY recent DESC
    LIMIT 50
  `).all(maxDate) as RecentRow[];

  const recentMap: Record<string, number> = {};
  for (const r of recentActivity) {
    recentMap[r.writer] = r.recent;
  }

  // 3. Weekly trend for top reporters (last 8 weeks)
  const topWriters = reporters.slice(0, 20).map((r) => r.writer);
  const weeklyData: Record<string, number[]> = {};

  if (topWriters.length > 0) {
    const placeholders = topWriters.map(() => "?").join(",");
    const weekly = db.prepare(`
      SELECT writer, strftime('%W', published_at) as week_num, COUNT(*) as cnt
      FROM articles
      WHERE writer IN (${placeholders})
        AND published_at >= date(?, '-55 days')
      GROUP BY writer, week_num
      ORDER BY week_num
    `).all(...topWriters, maxDate) as WeeklyRow[];

    const weeks = [...new Set(weekly.map((r) => r.week_num))].sort();
    for (const w of topWriters) {
      weeklyData[w] = weeks.map((wk) => {
        const row = weekly.find((r) => r.writer === w && r.week_num === wk);
        return row?.cnt || 0;
      });
    }
  }

  // 4. Cross-beat convergence
  const convergenceRaw = db.prepare(`
    SELECT original_category_name as topic,
      COUNT(DISTINCT writer) as writer_count,
      COUNT(DISTINCT category) as beat_count,
      COUNT(*) as article_count
    FROM articles
    WHERE published_at >= date(?, '-6 days')
      AND original_category_name IS NOT NULL
    GROUP BY original_category_name
    HAVING beat_count >= 3 AND writer_count >= 3
    ORDER BY beat_count DESC, writer_count DESC
    LIMIT 10
  `).all(maxDate) as { topic: string; writer_count: number; beat_count: number; article_count: number }[];

  // 5. Beat distribution per convergence topic (NEW)
  const convTopics = convergenceRaw.map((c) => c.topic);
  const convBeatMap: Record<string, { beat: string; count: number }[]> = {};
  const convReporterMap: Record<string, { name: string; beat: string; count: number }[]> = {};

  if (convTopics.length > 0) {
    const ph = convTopics.map(() => "?").join(",");

    // Beat distribution
    const convBeats = db.prepare(`
      SELECT original_category_name as topic, category, COUNT(*) as cnt
      FROM articles
      WHERE published_at >= date(?, '-6 days')
        AND original_category_name IN (${ph})
      GROUP BY original_category_name, category
      ORDER BY cnt DESC
    `).all(maxDate, ...convTopics) as ConvBeatRow[];

    for (const row of convBeats) {
      if (!convBeatMap[row.topic]) convBeatMap[row.topic] = [];
      convBeatMap[row.topic].push({
        beat: LABELS[row.category] || row.category,
        count: row.cnt,
      });
    }

    // Top reporters per convergence topic
    const convReporters = db.prepare(`
      SELECT original_category_name as topic, writer, category, COUNT(*) as cnt
      FROM articles
      WHERE published_at >= date(?, '-6 days')
        AND original_category_name IN (${ph})
        AND writer IS NOT NULL AND writer != ''
      GROUP BY original_category_name, writer
      ORDER BY original_category_name, cnt DESC
    `).all(maxDate, ...convTopics) as ConvReporterRow[];

    for (const row of convReporters) {
      if (!convReporterMap[row.topic]) convReporterMap[row.topic] = [];
      if (convReporterMap[row.topic].length < 5) {
        convReporterMap[row.topic].push({
          name: row.writer.split("(")[0].trim(),
          beat: LABELS[row.category] || row.category,
          count: row.cnt,
        });
      }
    }
  }

  const convergence = convergenceRaw.map((c) => ({
    ...c,
    beatDistribution: convBeatMap[c.topic] || [],
    topReporters: convReporterMap[c.topic] || [],
  }));

  // 6. Beat breakdown per leaderboard reporter (NEW)
  const top15Writers = reporters.slice(0, 15).map((r) => r.writer);
  const beatBreakdownMap: Record<string, { beat: string; count: number }[]> = {};

  if (top15Writers.length > 0) {
    const ph = top15Writers.map(() => "?").join(",");
    const beatRows = db.prepare(`
      SELECT writer, category, COUNT(*) as cnt
      FROM articles
      WHERE writer IN (${ph})
      GROUP BY writer, category
      ORDER BY writer, cnt DESC
    `).all(...top15Writers) as BeatRow[];

    for (const row of beatRows) {
      if (!beatBreakdownMap[row.writer]) beatBreakdownMap[row.writer] = [];
      beatBreakdownMap[row.writer].push({
        beat: LABELS[row.category] || row.category,
        count: row.cnt,
      });
    }
  }

  // 7. Overall beat activity summary (NEW)
  const beatSummaryRaw = db.prepare(`
    SELECT category, COUNT(DISTINCT writer) as writers, COUNT(*) as articles
    FROM articles
    WHERE published_at >= date(?, '-6 days')
      AND writer IS NOT NULL AND writer != ''
    GROUP BY category
  `).all(maxDate) as { category: string; writers: number; articles: number }[];

  const beatSummary = beatSummaryRaw.map((r) => ({
    beat: LABELS[r.category] || r.category,
    writers: r.writers,
    articles: r.articles,
  }));

  // Build response
  const leaderboard = reporters.slice(0, 15).map((r) => {
    const avgWeekly = Math.round((r.total / 52) * 10) / 10;
    const recentCount = recentMap[r.writer] || 0;
    const surgeRatio = avgWeekly > 0 ? Math.round((recentCount / avgWeekly) * 10) / 10 : 0;
    const isSpecialist = r.primary_count / r.total > 0.8;

    return {
      name: r.writer,
      total: r.total,
      primaryBeat: LABELS[r.primary_cat] || r.primary_cat,
      isSpecialist,
      beatCount: r.cat_count,
      recentCount,
      avgWeekly,
      surgeRatio,
      weeklyTrend: weeklyData[r.writer] || [],
      beatBreakdown: beatBreakdownMap[r.writer] || [],
    };
  });

  return NextResponse.json({
    leaderboard,
    convergence,
    beatSummary,
    referenceDate: maxDate,
  });
}
