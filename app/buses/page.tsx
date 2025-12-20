"use client";

import { BusForm } from "@/components/BusForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus } from "@/types";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuses = () => {
    setLoading(true);
    fetch("/api/buses")
      .then((res) => res.json())
      .then((data) => {
        setBuses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Add New Bus</CardTitle>
          </CardHeader>
          <CardContent>
            <BusForm onSuccess={fetchBuses} />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Current Fleet</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4">
            {buses.map((bus) => (
              <Card key={bus.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{bus.number}</span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        bus.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {bus.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Capacity: {bus.capacity} seats
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
