"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Pencil } from "lucide-react";

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bus: {
    id: string;
    number: string;
    status: string;
    maintenance_notes?: string | null;
    next_maintenance_date?: string | null;
    last_odometer_reading?: number | null;
  } | null;
  onSuccess: () => void;
}

export function MaintenanceModal({ isOpen, onClose, bus, onSuccess }: MaintenanceModalProps) {
  const isEditing = bus?.status === "scheduled";

  // Use dd/mm/yyyy format for the input display
  const formatDateForDisplay = (isoDate: string | null | undefined) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [dateStr, setDateStr] = useState("");
  const [odometer, setOdometer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bus) {
      setDateStr(bus.next_maintenance_date ? formatDateForDisplay(bus.next_maintenance_date) : "");
      setOdometer(bus.last_odometer_reading?.toString() || "");
    }
  }, [bus]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    
    let formatted = value;
    if (value.length > 2) {
      formatted = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length > 4) {
      formatted = formatted.slice(0, 5) + "/" + formatted.slice(5);
    }
    setDateStr(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bus) return;

    // Validate and convert dd/mm/yyyy to ISO
    const parts = dateStr.split("/");
    if (parts.length !== 3 || parts[2].length !== 4) {
      toast.error("Please enter a valid date in dd/mm/yyyy format");
      return;
    }
    const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    if (isNaN(new Date(isoDate).getTime())) {
      toast.error("Invalid date");
      return;
    }

    setIsSubmitting(true);
    try {
        const response = await fetch(`/api/buses/${bus.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "scheduled",
            next_maintenance_date: isoDate,
            last_odometer_reading: odometer ? parseFloat(odometer) : null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Maintenance update failed:", errorData);
          throw new Error(errorData.error || "Failed to update schedule");
        }

      toast.success(isEditing ? "Schedule updated successfully" : "Maintenance scheduled successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update maintenance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border/50 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {isEditing ? (
              <>
                <Pencil className="w-5 h-5 text-sidebar-primary" />
                Edit Schedule
              </>
            ) : (
              <>
                <CalendarIcon className="w-5 h-5 text-primary" />
                Schedule Maintenance
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? `Update the maintenance details for Bus #${bus?.number}.`
              : `Set the service date and record the current odometer reading for Bus #${bus?.number}.`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4 px-1">
          {bus?.maintenance_notes && (
            <div className={`p-3 border rounded-xl ${isEditing ? 'bg-sidebar-primary/10 border-sidebar-primary/20' : 'bg-red-500/10 border-red-500/20'}`}>
              <p className={`text-[10px] font-bold uppercase mb-1 ${isEditing ? 'text-sidebar-primary' : 'text-red-500'}`}>
                Issue Reported
              </p>
              <p className="text-sm text-foreground italic">{bus.maintenance_notes}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">Service Date</Label>
            <Input
              id="date"
              type="text"
              placeholder="dd/mm/yyyy"
              value={dateStr}
              onChange={handleDateChange}
              className="bg-secondary/50 border-border/50 rounded-xl focus:ring-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="odometer" className="text-sm font-medium">Odometer Reading (km)</Label>
            <Input
              id="odometer"
              type="number"
              placeholder="e.g. 45000"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="bg-secondary/50 border-border/50 rounded-xl focus:ring-primary"
              required
            />
          </div>
          <DialogFooter className="px-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-border/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-xl text-primary-foreground hover:opacity-90 ${isEditing ? 'bg-sidebar-primary' : 'bg-primary'}`}
            >
              {isSubmitting ? "Saving..." : (isEditing ? "Update Schedule" : "Save Schedule")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
