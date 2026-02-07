"use client";

import { RouteForm } from "@/components/RouteForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShinyCard } from "@/components/ui/ShinyCard";
import { Route } from "@/types";
import { useEffect, useState } from "react";
import { Bus as BusIcon, Navigation } from "lucide-react";

import { RouteEditDialog } from "@/components/RouteEditDialog";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = () => {
    setLoading(true);
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => {
        setRoutes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <Card className="rounded-3xl border-border bg-card">
          <CardHeader>
            <CardTitle>Create New Route</CardTitle>
          </CardHeader>
          <CardContent>
            <RouteForm onSuccess={fetchRoutes} />
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-2">
        {(() => {
          const routesArray = Array.isArray(routes) ? routes : [];
          return (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Active Routes</h2>
                <span className="text-sm text-muted-foreground">{routesArray.length} routes</span>
              </div>

              {loading ? (
                <p className="text-muted-foreground">Loading routes...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {routesArray.map((route) => (
                    <ShinyCard key={route.id} className="p-5 relative">
                      <RouteEditDialog route={route} onSuccess={fetchRoutes} />
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary">
                            <Navigation className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-lg pr-8">{route.name}</h3>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/50 flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-1">
                          <BusIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-semibold text-foreground/80">Assigned Fleet</span>
                        </div>

                        {(() => {
                          // Normalize buses safely
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const busesList = Array.isArray(route.buses) ? route.buses : (route.buses ? [route.buses] as any[] : []);

                          return busesList.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {busesList.map((bus: any) => (
                                <div key={bus.id} className="text-xs bg-sidebar-primary/10 text-sidebar-primary px-2 py-1 rounded-md border border-sidebar-primary/20 flex items-center gap-2">
                                  <span className="font-bold">{bus.number}</span>
                                  <span className="text-[10px] opacity-70">({bus.capacity} seats)</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground italic">No buses assigned</div>
                          );
                        })()}
                      </div>
                    </ShinyCard>
                  ))}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
