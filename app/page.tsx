"use client";

import { FleetStatusChart } from "@/components/dashboard/FleetStatusChart";
import { ActiveRoutes } from "@/components/dashboard/ActiveRoutes";
import { AlertCard, MapCard, OperationsCard } from "@/components/dashboard/StatsCards";
import { MaintenanceAlerts } from "@/components/dashboard/MaintenanceAlerts";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 h-full pb-6">
      {/* Top Section: Fleet Status + Alerts + Active Routes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-6">

        {/* Fleet Chart - Main Focus */}
        <div className="xl:col-span-6 min-h-[400px]">
          <FleetStatusChart />
        </div>

        {/* Right Column - Alerts & Active Routes */}
        <div className="xl:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="md:col-span-2">
            <AlertCard />
          </div>
          <div className="min-h-[300px]">
            <ActiveRoutes />
          </div>
          <div className="min-h-[300px]">
            <MaintenanceAlerts />
          </div>
        </div>
      </div>

      {/* Bottom Section: Map & Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 min-h-[250px]">
          <MapCard />
        </div>
        <div className="lg:col-span-1 min-h-[250px]">
          <OperationsCard />
        </div>
        {/* Placeholder for future expansion or another widget */}
        <div className="lg:col-span-2 min-h-[250px] bg-card/50 rounded-3xl border border-dashed border-border/50 flex items-center justify-center text-muted-foreground text-sm">
          <span>More metrics coming soon...</span>
        </div>
      </div>
    </div>
  );
}
