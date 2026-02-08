"use client";

import { FleetStatusChart } from "@/components/dashboard/FleetStatusChart";
import { ActiveRoutes } from "@/components/dashboard/ActiveRoutes";
import { AlertCard, FleetCapacityCard, RouteInsightsCard, FleetSummaryCard } from "@/components/dashboard/StatsCards";
import { MaintenanceAlerts } from "@/components/dashboard/MaintenanceAlerts";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Subscribe to realtime changes
    const busesSubscription = supabase
      .channel('buses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'buses' }, () => {
        console.log('Buses changed, refreshing stats...');
        fetchStats();
      })
      .subscribe();

    const studentsSubscription = supabase
      .channel('students-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        console.log('Students changed, refreshing stats...');
        fetchStats();
      })
      .subscribe();

    const routesSubscription = supabase
      .channel('routes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'routes' }, () => {
        console.log('Routes changed, refreshing stats...');
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(busesSubscription);
      supabase.removeChannel(studentsSubscription);
      supabase.removeChannel(routesSubscription);
    };
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full pb-6">
      {/* Top Section: Fleet Status + Alerts + Active Routes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-6">

        {/* Fleet Chart - Main Focus */}
        <div className="xl:col-span-6 min-h-[400px]">
          <FleetStatusChart data={stats?.fleetStatus} />
        </div>

        {/* Right Column - Alerts & Active Routes */}
        <div className="xl:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="md:col-span-2">
            <AlertCard maintenanceCount={stats?.fleetStatus?.maintenance || 0} />
          </div>
          <div className="min-h-[300px]">
            <ActiveRoutes />
          </div>
          <div className="min-h-[300px]">
            <MaintenanceAlerts alerts={stats?.maintenanceAlerts || []} />
          </div>
        </div>
      </div>

      {/* Middle Section: Capacity & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 min-h-[250px]">
          <FleetCapacityCard 
            occupancyRate={stats?.occupancyRate || 0} 
            totalOccupied={stats?.totalOccupied || 0} 
            totalCapacity={stats?.totalCapacity || 0} 
          />
        </div>
        <div className="lg:col-span-1 min-h-[250px]">
          <RouteInsightsCard insights={stats?.routeInsights || []} />
        </div>
        
        {/* Fleet Summary Summary */}
        <div className="lg:col-span-2 min-h-[250px]">
          <FleetSummaryCard stats={stats} />
        </div>
      </div>
    </div>
  );
}
