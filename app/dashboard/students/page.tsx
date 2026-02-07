"use client";

import { StudentForm } from "@/components/StudentForm";
import { StudentAssignment } from "@/components/StudentAssignment";
import { StudentEditDialog } from "@/components/StudentEditDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShinyCard } from "@/components/ui/ShinyCard";
import { Student, PaginatedResponse, Pagination, Route } from "@/types";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { User, MapPin, Armchair, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRoutes = useCallback(() => {
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => setRoutes(data))
      .catch((err) => console.error("Error fetching routes:", err));
  }, []);

  const fetchStudents = useCallback((page: number = 1) => {
    setLoading(true);
    fetch(`/api/students?page=${page}&limit=12`)
      .then((res) => res.json())
      .then((resData: PaginatedResponse<Student>) => {
        setStudents(resData.data || []);
        setPagination(resData.pagination || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setStudents([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchRoutes();
    fetchStudents(currentPage);
  }, [fetchRoutes, fetchStudents, currentPage]);

  const studentsWithRoutes = useMemo(() => {
    if (!Array.isArray(students)) return [];
    const routesArray = Array.isArray(routes) ? routes : [];
    return students.map(student => ({
      ...student,
      route: routesArray.find(r => r.id === student.route_id)
    }));
  }, [students, routes]);

  const filteredStudents = useMemo(() => {
    return studentsWithRoutes.filter(
      (s) =>
        (s.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (s.student_id?.toLowerCase() || "").includes(search.toLowerCase())
    );
  }, [studentsWithRoutes, search]);

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-border bg-card">
          <CardHeader>
            <CardTitle>Add New Student</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentForm onSuccess={() => fetchStudents(currentPage)} />
          </CardContent>
        </Card>

        <div className="h-full">
          {selectedStudent ? (
            <StudentAssignment
              student={selectedStudent}
              onUpdate={() => {
                fetchStudents(currentPage);
                setSelectedStudent(null);
              }}
              onCancel={() => setSelectedStudent(null)}
            />
          ) : (
            <div className="h-full min-h-[200px] border-2 border-dashed border-border/50 rounded-3xl flex items-center justify-center text-muted-foreground p-6 text-center">
              <p>Select a student from the list to manage their seat assignment.</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold">Student Directory</h2>
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md bg-secondary/50 border-input"
          />
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <ShinyCard key={student.id} className="p-4 flex flex-col gap-3 group/card relative">
                  <div
                    className="absolute top-4 right-4 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <StudentEditDialog student={student} onSuccess={() => fetchStudents(currentPage)} />
                  </div>

                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedStudent(student)}>
                    <div className="w-10 h-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center text-sidebar-primary overflow-hidden">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground group-hover/card:text-sidebar-primary transition-colors">{student.name}</h4>
                      <p className="text-xs text-muted-foreground font-mono">{student.student_id}</p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border/50" />

                  <div className="grid grid-cols-2 gap-2 text-xs cursor-pointer" onClick={() => setSelectedStudent(student)}>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{student.route?.name || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Armchair className="w-3 h-3" />
                      <span>{student.seat_number ? `Seat: ${student.seat_number}` : "No Seat"}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="w-full py-1.5 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-sidebar-primary hover:text-white transition-colors"
                    >
                      Manage Seat
                    </button>
                  </div>
                </ShinyCard>
              ))}
              {filteredStudents.length === 0 && (
                <div className="col-span-full p-8 text-center text-muted-foreground">No students found.</div>
              )}
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
