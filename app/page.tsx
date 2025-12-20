"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [stats, setStats] = useState({
    buses: 0,
    routes: 0,
    students: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/buses").then((res) => res.json()),
      fetch("/api/routes").then((res) => res.json()),
      fetch("/api/students").then((res) => res.json()),
    ])
      .then(([buses, routes, students]) => {
        setStats({
          buses: buses.length,
          routes: routes.length,
          students: students.length,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.buses}</div>
              <p className="text-xs text-muted-foreground">
                Active & Maintenance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.routes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.students}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 flex-wrap">
                <Link href="/buses">
                    <Button>Manage Buses</Button>
                </Link>
                <Link href="/routes">
                    <Button>Manage Routes</Button>
                </Link>
                <Link href="/students">
                    <Button>Manage Students</Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
