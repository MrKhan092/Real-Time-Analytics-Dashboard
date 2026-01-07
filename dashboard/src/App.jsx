import React, { useEffect, useMemo, useState, useCallback } from "react";
import { getStats } from "./api";
import { useSocket } from "./hooks/useSocket";
import StatsCards from "./components/StatsCards";
import EventsChart from "./components/EventsChart";
import TopTable from "./components/TopTable";
import LiveFeed from "./components/LiveFeed";
import TimeRange from "./components/TimeRange";
import ConnectionStatus from "./components/ConnectionStatus";
import ErrorBoundary from "./components/ErrorBoundary";
import FilterBar from "./components/FilterBar";
import ExportButton from "./components/ExportButton";
import MetricsComparison from "./components/MetricsComparison";
import EventTypeDistribution from "./components/EventTypeDistribution";
import UserActivity from "./components/UserActivity";
import PerformanceMetrics from "./components/PerformanceMetrics";
import SessionTimeline from "./components/SessionTimeline";
import QuickStats from "./components/QuickStats";
import AlertPanel from "./components/AlertPanel";

export default function App() {
  const [agg, setAgg] = useState({ 
    last1s: 0, 
    last5s: 0, 
    last60s: 0, 
    activeUsers: 0,
    errorRate: 0 
  });
  const [series, setSeries] = useState([]);
  const [feed, setFeed] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [actions, setActions] = useState([]);
  const [range, setRange] = useState(60);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filter, setFilter] = useState({ route: "", action: "" });
  const [isPaused, setIsPaused] = useState(false);

  useSocket(
    useCallback((a) => {
      if (isPaused) return;
      setAgg(a);
      setSeries(prev => [...prev, { t: Date.now(), v: a.last1s }].slice(-600));
      setLastUpdate(new Date());
    }, [isPaused]),
    useCallback((e) => {
      if (isPaused) return;
      if (filter.route && !e.route.includes(filter.route)) return;
      if (filter.action && !e.action.includes(filter.action)) return;
      setFeed(prev => [...prev, e].slice(-100));
    }, [isPaused, filter]),
    useCallback((events) => {
      if (isPaused) return;
      setFeed(prev => [...prev, ...events].slice(-100));
    }, [isPaused]),
    {
      onConnect: useCallback(() => {
        console.log("🎉 App: Socket connected!");
        setIsConnected(true);
      }, []),
      onDisconnect: useCallback(() => {
        console.log("😞 App: Socket disconnected!");
        setIsConnected(false);
      }, [])
    }
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStats();
        setRoutes(res.dbTopRoutes || []);
        setActions((res.topRoutes || []).map(r => ({ 
          route: r.route, 
          count: r.count 
        })));
      } catch (e) {
        console.error("Failed to load stats:", e);
      }
    };
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  const visible = useMemo(() => {
    const cutoff = Date.now() - range * 1000;
    return series.filter(p => p.t >= cutoff);
  }, [series, range]);

  const peakEventsPerSec = useMemo(() => {
    if (visible.length === 0) return 0;
    return Math.max(...visible.map(p => p.v));
  }, [visible]);

  const handleExport = useCallback(() => {
    const data = {
      aggregates: agg,
      series: visible,
      feed: feed,
      routes: routes,
      actions: actions,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: "application/json" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [agg, visible, feed, routes, actions]);

  return (
    <ErrorBoundary>
      <div style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)", 
        padding: "20px", 
        color: "#e2e8f0", 
        fontFamily: "Inter, system-ui, Arial" 
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 800, 
              margin: 0,
              background: "linear-gradient(90deg, #22d3ee 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Real-Time Analytics
            </h1>
            <p style={{ 
              margin: "8px 0 0 0", 
              opacity: 0.7, 
              fontSize: 14 
            }}>
              Live view of your site traffic and user actions
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <ConnectionStatus 
              isConnected={isConnected} 
              lastUpdate={lastUpdate} 
            />
            <button
              onClick={() => setIsPaused(!isPaused)}
              style={{
                padding: "8px 16px",
                background: isPaused ? "#ef4444" : "#10b981",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14
              }}
            >
              {isPaused ? "⏸️ Paused" : "▶️ Live"}
            </button>
            <ExportButton onClick={handleExport} />
          </div>
        </div>

        <AlertPanel agg={agg} series={series} />
        <QuickStats feed={feed} series={series} agg={agg} />
        <FilterBar filter={filter} onChange={setFilter} />
        <StatsCards agg={agg} peakEventsPerSec={peakEventsPerSec} />
        <MetricsComparison currentAgg={agg} series={series} />
        <PerformanceMetrics agg={agg} series={series} />

        <div style={{ marginBottom: "16px" }}>
          <SessionTimeline feed={feed} />
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          marginBottom: "16px" 
        }}>
          <TimeRange value={range} onChange={setRange} />
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "2fr 1fr", 
          gap: 16, 
          marginBottom: 16 
        }}>
          <div style={{ 
            background: "rgba(15, 23, 42, 0.6)", 
            backdropFilter: "blur(10px)",
            borderRadius: 16, 
            padding: 20,
            border: "1px solid rgba(34, 211, 238, 0.1)"
          }}>
            <div style={{ 
              marginBottom: 12, 
              fontWeight: 600,
              fontSize: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>⚡ Events per Second</span>
              <span style={{ 
                fontSize: 14, 
                opacity: 0.7,
                fontWeight: 400
              }}>
                Peak: {peakEventsPerSec.toFixed(1)}/s
              </span>
            </div>
            <EventsChart series={visible} />
          </div>
          <LiveFeed feed={feed} isPaused={isPaused} />
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: 16, 
          marginBottom: 16 
        }}>
          <EventTypeDistribution feed={feed} />
          <UserActivity feed={feed} />
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: 16 
        }}>
          <TopTable 
            title="🔝 Top Routes (5m)" 
            rows={routes} 
            keyField="route"
            valueField="count"
          />
          <TopTable 
            title="🎯 Top Actions (5m)" 
            rows={actions}
            keyField="route"
            valueField="count"
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}