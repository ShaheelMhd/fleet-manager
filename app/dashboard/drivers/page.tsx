"use client";

import { DriverForm } from "@/components/DriverForm";
import { DriverEditDialog } from "@/components/DriverEditDialog";
import { DriverDeleteDialog } from "@/components/DriverDeleteDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Driver, PaginatedResponse, Pagination, Bus } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { User, Phone, ChevronLeft, ChevronRight, Search, Check, ChevronsUpDown, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Extended Driver type to include bus information from the join
interface DriverWithBus extends Driver {
  buses: {
    id: string;
    number: string;
  } | {
    id: string;
    number: string;
  }[] | null;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<DriverWithBus[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [assigningBusId, setAssigningBusId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchDrivers = useCallback((page: number = 1, searchTerm: string = "") => {
    setLoading(true);
    const query = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });
    if (searchTerm) {
      query.append("search", searchTerm);
    }

    fetch(`/api/drivers?${query.toString()}`)
      .then((res) => res.json())
      .then((resData: PaginatedResponse<DriverWithBus>) => {
        setDrivers(resData.data || []);
        setPagination(resData.pagination || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching drivers:", err);
        setDrivers([]);
        setLoading(false);
      });
  }, []);

  const fetchBuses = useCallback(() => {
    fetch("/api/buses?limit=100")
      .then((res) => res.json())
      .then((resData: PaginatedResponse<Bus>) => {
        setBuses(resData.data || []);
      })
      .catch((err) => console.error("Error fetching buses:", err));
  }, []);

  useEffect(() => {
    fetchDrivers(currentPage, search);
    fetchBuses();
  }, [fetchDrivers, fetchBuses, currentPage, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const assignBus = async (driverId: string, busId: string | null) => {
    setAssigningBusId(driverId);
    try {
      // Step 1: Find the bus that currently has this driver and clear it
      const currentBus = buses.find(b => b.driver_id === driverId);
      if (currentBus) {
        await fetch(`/api/buses/${currentBus.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ driver_id: null }),
        });
      }

      // Step 2: If a new bus is selected, assign the driver to it
      if (busId) {
        const response = await fetch(`/api/buses/${busId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ driver_id: driverId }),
        });

        if (!response.ok) throw new Error("Failed to assign bus");
        toast.success("Bus assigned successfully");
      } else if (currentBus) {
        toast.success("Bus unassigned successfully");
      }

      fetchDrivers(currentPage, search);
      fetchBuses();
    } catch (error) {
      toast.error("Failed to assign bus");
      console.error(error);
    } finally {
      setAssigningBusId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-0">
      {/* Top Actions Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
          <p className="text-muted-foreground mt-1">Manage your fleet drivers and their assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search drivers..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10 bg-card border-none shadow-sm"
            />
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg shadow-sidebar-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>
                  Enter driver details and optionally assign a bus.
                </DialogDescription>
              </DialogHeader>
              <DriverForm onSuccess={() => {
                setIsAddModalOpen(false);
                fetchDrivers(currentPage, search);
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-secondary/10 py-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Driver Directory</CardTitle>
            <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
              {pagination?.total || 0} Total Drivers
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead className="font-bold text-foreground h-12">Driver Name</TableHead>
                  <TableHead className="font-bold text-foreground h-12">Phone Number</TableHead>
                  <TableHead className="font-bold text-foreground h-12">Assigned Bus</TableHead>
                  <TableHead className="text-right font-bold text-foreground h-12 px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-sidebar-primary" />
                        <span>Loading driver data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : drivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <User className="w-10 h-10 opacity-20" />
                        <p>No drivers found. Try adding a new driver.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  drivers.map((driver) => {
                    const assignedBus = Array.isArray(driver.buses) ? driver.buses[0] : driver.buses;
                    return (
                      <TableRow key={driver.id} className="hover:bg-secondary/20 transition-colors border-b last:border-0">
                        <TableCell className="font-medium py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary shadow-inner">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="text-foreground">{driver.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-3.5 h-3.5" />
                            {driver.phone_number || <span className="italic opacity-50 text-xs">Not provided</span>}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                size="sm"
                                className={cn(
                                  "w-[160px] justify-between rounded-lg font-normal bg-secondary/30 border-none hover:bg-secondary/50",
                                  !assignedBus && "text-muted-foreground italic"
                                )}
                                disabled={assigningBusId === driver.id}
                              >
                                {assignedBus ? `Bus ${assignedBus.number}` : "Assign Bus"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0 rounded-xl shadow-xl border-border">
                              <Command>
                                <CommandInput placeholder="Search bus..." />
                                <CommandList>
                                  <CommandEmpty>No bus found.</CommandEmpty>
                                  <CommandGroup>
                                    <CommandItem
                                      value="none"
                                      onSelect={() => assignBus(driver.id, null)}
                                      className="rounded-lg m-1"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          !assignedBus ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      None (Unassign)
                                    </CommandItem>
                                    {buses.map((bus) => (
                                      <CommandItem
                                        key={bus.id}
                                        value={bus.number}
                                        onSelect={() => assignBus(driver.id, bus.id)}
                                        className="rounded-lg m-1"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            assignedBus?.id === bus.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        Bus {bus.number}
                                        {bus.driver_id && bus.driver_id !== driver.id && (
                                          <span className="ml-auto text-[10px] text-orange-500 font-medium bg-orange-500/10 px-1.5 py-0.5 rounded">Occupied</span>
                                        )}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell className="text-right py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <DriverEditDialog driver={driver} onSuccess={() => fetchDrivers(currentPage, search)} />
                            <DriverDeleteDialog driver={driver} onSuccess={() => fetchDrivers(currentPage, search)} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 pb-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-xl px-4 h-10 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "w-10 h-10 rounded-xl",
                  currentPage === page ? "shadow-md shadow-sidebar-primary/20" : "text-muted-foreground"
                )}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={currentPage === pagination.totalPages}
            className="rounded-xl px-4 h-10 shadow-sm"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
