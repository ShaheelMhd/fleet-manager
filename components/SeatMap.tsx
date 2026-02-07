"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface SeatMapProps {
  totalSeats: number;
  occupiedSeats: number[];
  occupiedSeatsMap?: Record<number, string>;
  selectedSeat?: number | null;
  onSeatSelect?: (seatNumber: number) => void;
  readOnly?: boolean;
}

export function SeatMap({
  totalSeats,
  occupiedSeats,
  occupiedSeatsMap = {},
  selectedSeat,
  onSeatSelect,
  readOnly = false,
}: SeatMapProps) {
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center">
      {/* Bus Container */}
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-6 pt-10 shadow-2xl inline-block scale-90 origin-top">

        {/* Front / Driver Area */}
        <div className="absolute top-4 right-8 text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 border border-border rounded-full">
              <div className="w-6 h-6 rounded-full border-t-4 border-muted-foreground transform -rotate-45"></div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider">Driver</span>
          </div>
        </div>

        <div className="w-full text-center text-xs text-muted-foreground mb-6 uppercase tracking-widest font-semibold">Front</div>

        {/* Seats Grid */}
        <div className="grid grid-cols-[repeat(2,minmax(32px,1fr))_32px_repeat(2,minmax(32px,1fr))] gap-y-3 gap-x-2">
          {seats.map((seatNumber, index) => {
            const isOccupied = occupiedSeats.includes(seatNumber);
            const isSelected = selectedSeat === seatNumber;
            const isAisle = (index % 4) === 2;

            return (
              <React.Fragment key={seatNumber}>
                {isAisle && <div className="flex items-center justify-center text-xs text-muted-foreground/30 font-mono select-none"></div>}
                <button
                  disabled={isOccupied || readOnly}
                  onClick={() => onSeatSelect?.(seatNumber)}
                  className={cn(
                    "group relative h-10 w-8 flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95",
                    "rounded-t-lg rounded-b-md shadow-sm border-b-4",
                    isOccupied
                      ? "bg-muted border-muted-foreground/50 text-muted-foreground cursor-not-allowed opacity-50"
                      : isSelected
                        ? "bg-sidebar-primary border-sidebar-ring text-primary-foreground z-10 scale-110 shadow-[0_0_15px_rgba(157,78,221,0.5)]"
                        : "bg-secondary border-border hover:border-sidebar-primary/50 text-foreground hover:bg-secondary/80"
                  )}
                  title={isOccupied ? `Seat ${seatNumber} - ${occupiedSeatsMap[seatNumber] || "Occupied"}` : `Seat ${seatNumber}`}
                >
                  {/* Seat Back Detail */}
                  <div className={cn(
                    "absolute -top-1 w-[80%] h-1 rounded-t-sm opacity-30",
                    isOccupied ? "bg-black" : isSelected ? "bg-white" : "bg-muted-foreground"
                  )}></div>

                  <span className="text-sm font-bold font-mono">{seatNumber}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="w-full text-center text-xs text-muted-foreground mt-8 uppercase tracking-widest font-semibold">Rear</div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs mt-6 bg-secondary/30 p-3 rounded-full shadow-sm border border-border backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-secondary border border-border rounded shadow-sm"></div>
          <span className="font-medium text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted border border-muted-foreground/50 rounded shadow-sm"></div>
          <span className="font-medium text-muted-foreground">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-sidebar-primary border border-sidebar-ring rounded shadow-sm"></div>
          <span className="font-medium text-muted-foreground">Selected</span>
        </div>
      </div>
    </div>
  );
}
