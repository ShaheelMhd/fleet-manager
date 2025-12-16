"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface SeatMapProps {
  totalSeats: number;
  occupiedSeats: number[];
  selectedSeat?: number | null;
  onSeatSelect?: (seatNumber: number) => void;
  readOnly?: boolean;
}

export function SeatMap({
  totalSeats,
  occupiedSeats,
  selectedSeat,
  onSeatSelect,
  readOnly = false,
}: SeatMapProps) {
  // Generate seat numbers
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  // Simple 2x2 layout (Left Side -- Aisle -- Right Side)
  // Assuming 4 seats per row for standard bus
  
  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
      <div className="w-full text-center text-sm text-gray-500 mb-2">Front of Bus</div>
      <div className="grid grid-cols-[repeat(2,minmax(40px,1fr))_40px_repeat(2,minmax(40px,1fr))] gap-2">
        {seats.map((seatNumber, index) => {
          const isOccupied = occupiedSeats.includes(seatNumber);
          const isSelected = selectedSeat === seatNumber;
          
          // Add aisle spacer every 2 seats
          const isAisle = (index % 4) === 2;

          return (
            <>
              {isAisle && <div key={`aisle-${index}`} className="w-full" />}
              <button
                key={seatNumber}
                disabled={isOccupied || readOnly}
                onClick={() => onSeatSelect?.(seatNumber)}
                className={cn(
                  "h-10 w-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors border",
                  isOccupied
                    ? "bg-red-100 text-red-700 border-red-200 cursor-not-allowed"
                    : isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white hover:bg-gray-100 text-gray-900 border-gray-200"
                )}
                title={isOccupied ? `Seat ${seatNumber} (Occupied)` : `Seat ${seatNumber}`}
              >
                {seatNumber}
              </button>
            </>
          );
        })}
      </div>
      <div className="flex gap-4 text-xs mt-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
          <span>Occupied</span>
        </div>
         <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-primary border border-primary rounded"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}
