"use client";

import { Student, Route } from "@/types";
import { useEffect, useState } from "react";
import { SeatMap } from "./SeatMap";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { supabase } from "@/utils/supabaseClient";

interface StudentAssignmentProps {
  student: Student;
  onUpdate: () => void;
  onCancel: () => void;
}

export function StudentAssignment({ student, onUpdate, onCancel }: StudentAssignmentProps) {
  const [route, setRoute] = useState<Route | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(student.seat_number);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student.route_id) {
        // Fetch route details (including bus)
        fetch(`/api/routes`) // Optimally should use a by-id endpoint or filter
            .then(res => res.json())
            .then((data: Route[]) => {
                const r = data.find(r => r.id === student.route_id);
                if (r) setRoute(r);
            });

        // Fetch occupied seats for this route
        fetch(`/api/students?routeId=${student.route_id}`)
            .then(res => res.json())
            .then((data: Student[]) => {
                const seats = data
                    .map(s => s.seat_number)
                    .filter((s): s is number => s !== null);
                setOccupiedSeats(seats);
            });
    }
  }, [student.route_id]);

  const handleAssign = async () => {
    if (!selectedSeat || !student.route_id) return;

    setLoading(true);
    try {
      const response = await fetch("/api/assign-seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          routeId: student.route_id,
          seatNumber: selectedSeat,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign seat");
      }

      toast.success("Seat assigned successfully");
      onUpdate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!student.route_id) {
    return (
      <div className="p-4 border rounded bg-yellow-50 text-yellow-800">
        This student is not assigned to any route. Please edit the student to assign a route first.
        <div className="mt-2">
            <Button variant="outline" onClick={onCancel}>Close</Button>
        </div>
      </div>
    );
  }

  if (!route) return <div>Loading route details...</div>;
  if (!route.bus) return <div className="text-red-500">No bus assigned to this route. Cannot assign seats.</div>;

  return (
    <div className="space-y-4 border p-4 rounded-lg bg-white shadow-sm">
      <h3 className="font-bold text-lg">Assign Seat for {student.name}</h3>
      <p className="text-sm text-gray-500">
        Route: {route.name} | Bus: {route.bus.number}
      </p>
      
      <SeatMap
        totalSeats={route.bus.capacity}
        occupiedSeats={occupiedSeats.filter(s => s !== student.seat_number)} // Don't mark own seat as occupied
        selectedSeat={selectedSeat}
        onSeatSelect={setSelectedSeat}
      />

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleAssign} disabled={!selectedSeat || loading}>
          {loading ? "Assigning..." : "Confirm Assignment"}
        </Button>
      </div>
    </div>
  );
}
