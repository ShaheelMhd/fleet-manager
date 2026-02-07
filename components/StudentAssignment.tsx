"use client";

import { Student, Route } from "@/types";
import { useEffect, useState } from "react";
import { SeatMap } from "./SeatMap";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface StudentAssignmentProps {
  student: Student;
  onUpdate: () => void;
  onCancel: () => void;
}

export function StudentAssignment({ student, onUpdate, onCancel }: StudentAssignmentProps) {
  const [route, setRoute] = useState<Route | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
  const [occupiedSeatsMap, setOccupiedSeatsMap] = useState<Record<number, string>>({});
  const [selectedSeat, setSelectedSeat] = useState<number | null>(student.seat_number);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(student.bus_id || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student.route_id) {
      // Fetch route details (including buses)
      fetch(`/api/routes`)
        .then(res => res.json())
        .then((data: Route[]) => {
          const r = data.find(r => r.id === student.route_id);
          if (r) {
            setRoute(r);
            // Normalize buses for safe access
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const busesList = Array.isArray(r.buses) ? r.buses : (r.buses ? [r.buses] as any[] : []);

            // Default to first bus if none selected and buses exist
            if (!student.bus_id && !selectedBusId && busesList.length > 0) {
              setSelectedBusId(busesList[0].id);
            }
          }
        });

      // Fetch occupied seats for this route
      fetch(`/api/students?routeId=${student.route_id}`)
        .then(res => res.json())
        .then((data: Student[]) => {
          const busId = selectedBusId ?? student.bus_id;
          const filteredStudents = data.filter(s => s.bus_id === busId);
          
          const seats = filteredStudents
            .map(s => s.seat_number)
            .filter((s): s is number => s !== null);
          setOccupiedSeats(seats);

          const seatMap: Record<number, string> = {};
          filteredStudents.forEach(s => {
            if (s.seat_number) seatMap[s.seat_number] = s.name;
          });
          setOccupiedSeatsMap(seatMap);
        });
    }
  }, [student.route_id, selectedBusId, student.bus_id]); // Re-run when bus changes

  const handleAssign = async () => {
    if (!selectedSeat || !student.route_id || !selectedBusId) return;

    setLoading(true);
    try {
      const response = await fetch("/api/assign-seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          routeId: student.route_id,
          busId: selectedBusId,
          seatNumber: selectedSeat,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign seat");
      }

      toast.success("Seat assigned successfully");
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
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

  if (!route) return <div className="p-8 text-center text-muted-foreground">Loading route details...</div>;

  // Normalize buses to ensure it's always an array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const busesList = Array.isArray(route.buses) ? route.buses : (route.buses ? [route.buses] as any[] : []);

  if (busesList.length === 0) return <div className="p-8 text-center text-destructive">No fleet assigned to this route. Cannot assign seats.</div>;

  const currentBus = busesList.find((b: any) => b.id === selectedBusId) || busesList[0];

  return (
    <div className="space-y-4 border border-border p-6 rounded-3xl bg-card shadow-sm h-full flex flex-col items-center justify-center">
      <h3 className="font-bold text-lg">Assign Seat for {student.name}</h3>
      <div className="text-sm text-gray-500 flex flex-col items-center gap-2">
        <span>Route: {route.name}</span>

        {/* Bus Selector if multiple buses */}
        {busesList.length > 1 ? (
          <div className="flex items-center gap-2 mt-2 bg-secondary/30 p-1 rounded-lg">
            <span className="text-xs font-semibold px-2">Select Bus:</span>
            <select
              className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer font-bold text-sidebar-primary"
              value={selectedBusId || ""}
              onChange={(e) => {
                setSelectedBusId(e.target.value);
                setSelectedSeat(null); // Reset seat selection on bus change
              }}
            >
              {busesList.map((b: any) => (
                <option key={b.id} value={b.id}>{b.number} ({b.capacity} seats)</option>
              ))}
            </select>
          </div>
        ) : (
          <span className="text-sidebar-primary font-bold">Bus: {currentBus?.number}</span>
        )}
      </div>

      <div className="w-full flex justify-center py-4">
        {currentBus && (
          <SeatMap
            totalSeats={currentBus.capacity}
            occupiedSeats={occupiedSeats.filter(s => s !== student.seat_number)}
            occupiedSeatsMap={occupiedSeatsMap}
            selectedSeat={selectedSeat}
            onSeatSelect={id => {
              // Ensure bus is selected
              if (!selectedBusId) setSelectedBusId(currentBus.id);
              setSelectedSeat(id);
            }}
          />
        )}
      </div>

      <div className="flex gap-4 justify-end w-full">
        <Button variant="ghost" onClick={onCancel} className="hover:bg-secondary">Cancel</Button>
        <Button onClick={handleAssign} disabled={!selectedSeat || !selectedBusId || loading} className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-white">
          {loading ? "Assigning..." : "Confirm Assignment"}
        </Button>
      </div>
    </div>
  );
}
