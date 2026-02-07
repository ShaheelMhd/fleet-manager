"use client";

import { BusForm } from "@/components/BusForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShinyCard } from "@/components/ui/ShinyCard";
import { Bus, PaginatedResponse, Pagination } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { Bus as BusIcon, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { BusEditDialog } from "@/components/BusEditDialog";

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBuses = useCallback((page: number = 1) => {
    setLoading(true);
    fetch(`/api/buses?page=${page}&limit=10`)
      .then((res) => res.json())
      .then((resData: PaginatedResponse<Bus>) => {
        setBuses(resData.data || []);
        setPagination(resData.pagination || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setBuses([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchBuses(currentPage);
  }, [fetchBuses, currentPage]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-0">
      <div className="xl:col-span-1">
        <Card className="rounded-3xl border-border bg-card">
          <CardHeader>
            <CardTitle>Add New Bus</CardTitle>
          </CardHeader>
          <CardContent>
            <BusForm onSuccess={() => fetchBuses(currentPage)} />
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Current Fleet</h2>
          <span className="text-sm text-muted-foreground">{pagination?.total || 0} vehicles</span>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading fleet data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {buses.map((bus) => (
                <ShinyCard key={bus.id} className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary">
                        <BusIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-none mb-1">{bus.number}</h3>
                        <p className="text-xs text-muted-foreground">Capacity: {bus.capacity}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center ${bus.status === "active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        }`}>
                        {bus.status}
                      </div>
                      <BusEditDialog bus={bus} onSuccess={() => fetchBuses(currentPage)} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {bus.status === "active" ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-orange-500" />
                    )}
                    <span>{bus.status === 'active' ? 'Operational' : 'Needs Attention'}</span>
                  </div>
                </ShinyCard>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
