import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";

export async function GET() {
  try {
    // Fetch all buses
    const { data: buses, error: busesError } = await supabase
      .from("buses")
      .select("*");

    if (busesError) throw busesError;

    // Fetch all students
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*");

    if (studentsError) throw studentsError;

    // Fetch active routes
    const { data: routes, error: routesError } = await supabase
      .from("routes")
      .select("*");

    if (routesError) throw routesError;

    const totalCapacity = buses.reduce((acc, bus) => acc + bus.capacity, 0);
    const totalOccupied = students.filter(s => s.bus_id !== null).length;
    const occupancyRate = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;

    const stats = {
      fleetStatus: {
        active: buses.filter(b => b.status === "active").length,
        maintenance: buses.filter(b => b.status === "maintenance").length,
        idle: buses.filter(b => b.status === "idle").length,
      },
      totalStudents: students.length,
      activeRoutes: routes.length,
      totalCapacity,
      totalOccupied,
      occupancyRate: Math.round(occupancyRate),
      maintenanceAlerts: buses
        .filter(b => b.status === "maintenance")
        .map(b => ({ id: b.id, number: b.number })),
      routeInsights: routes.slice(0, 3).map(route => {
        const routeStudents = students.filter(s => s.route_id === route.id);
        const routeBuses = buses.filter(b => b.route_id === route.id);
        const routeCapacity = routeBuses.reduce((acc, b) => acc + b.capacity, 0);
        return {
          id: route.id,
          name: route.name,
          assigned: routeStudents.length,
          capacity: routeCapacity
        };
      })
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
