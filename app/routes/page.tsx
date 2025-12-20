"use client";

import { RouteForm } from "@/components/RouteForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "@/types";
import { useEffect, useState } from "react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Create New Route</CardTitle>
          </CardHeader>
          <CardContent>
            <RouteForm onSuccess={fetchRoutes} />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Routes</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4">
            {routes.map((route) => (
              <Card key={route.id}>
                <CardHeader>
                  <CardTitle>{route.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">
                    Bus Assigned:{" "}
                    {route.bus ? (
                      <span className="font-semibold">{route.bus.number}</span>
                    ) : (
                      <span className="text-red-500">None</span>
                    )}
                  </p>
                  {route.bus && (
                    <p className="text-xs text-gray-400">
                      Capacity: {route.bus.capacity}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
