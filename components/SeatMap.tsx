"use client";

import { cn } from "@/lib/utils";

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
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center">
      {/* Bus Container */}
      <div className="relative bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-3xl p-8 pt-12 shadow-xl inline-block">
        
        {/* Front / Driver Area */}
        <div className="absolute top-4 right-8 text-gray-400">
           <div className="flex flex-col items-center gap-1">
             <div className="p-2 border-2 border-gray-400 rounded-full">
                <div className="w-6 h-6 rounded-full border-t-4 border-gray-500 transform -rotate-45"></div>
             </div>
             <span className="text-[10px] uppercase font-bold tracking-wider">Driver</span>
           </div>
        </div>
        
        <div className="w-full text-center text-xs text-gray-400 mb-6 uppercase tracking-widest font-semibold">Front</div>

        {/* Seats Grid */}
        <div className="grid grid-cols-[repeat(2,minmax(40px,1fr))_40px_repeat(2,minmax(40px,1fr))] gap-y-4 gap-x-2">
          {seats.map((seatNumber, index) => {
            const isOccupied = occupiedSeats.includes(seatNumber);
            const isSelected = selectedSeat === seatNumber;
            const isAisle = (index % 4) === 2;

            return (
              <>
                {isAisle && <div key={`aisle-${index}`} className="flex items-center justify-center text-xs text-gray-300 font-mono select-none"></div>}
                <button
                  key={seatNumber}
                  disabled={isOccupied || readOnly}
                  onClick={() => onSeatSelect?.(seatNumber)}
                  className={cn(
                    "group relative h-12 w-10 flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95",
                    "rounded-t-lg rounded-b-md shadow-sm border-b-4",
                    isOccupied
                      ? "bg-red-500 border-red-700 text-white cursor-not-allowed opacity-80"
                      : isSelected
                      ? "bg-green-500 border-green-700 text-white z-10 scale-110"
                      : "bg-white border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50"
                  )}
                  title={isOccupied ? `Seat ${seatNumber} (Occupied)` : `Seat ${seatNumber}`}
                >
                  {/* Seat Back Detail */}
                  <div className={cn(
                      "absolute -top-1 w-[80%] h-1 rounded-t-sm opacity-30",
                       isOccupied ? "bg-red-900" : isSelected ? "bg-green-900" : "bg-gray-400"
                  )}></div>
                  
                  <span className="text-sm font-bold font-mono">{seatNumber}</span>
                </button>
              </>
            );
          })}
        </div>
        
        <div className="w-full text-center text-xs text-gray-400 mt-8 uppercase tracking-widest font-semibold">Rear</div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs mt-6 bg-white dark:bg-gray-900 p-3 rounded-full shadow-sm border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded shadow-sm"></div>
          <span className="font-medium text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 border border-red-700 rounded shadow-sm"></div>
          <span className="font-medium text-gray-600">Occupied</span>
        </div>
         <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 border border-green-700 rounded shadow-sm"></div>
          <span className="font-medium text-gray-600">Selected</span>
        </div>
      </div>
    </div>
  );
}
