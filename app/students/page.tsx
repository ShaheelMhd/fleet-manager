"use client";

import { StudentForm } from "@/components/StudentForm";
import { StudentAssignment } from "@/components/StudentAssignment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Student } from "@/types";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = () => {
    setLoading(true);
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Student</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentForm onSuccess={fetchStudents} />
          </CardContent>
        </Card>

        <div>
            {selectedStudent ? (
                <StudentAssignment 
                    student={selectedStudent} 
                    onUpdate={() => {
                        fetchStudents();
                        setSelectedStudent(null);
                    }}
                    onCancel={() => setSelectedStudent(null)}
                />
            ) : (
                <Card>
                    <CardHeader>
                         <CardTitle>Select a student to assign seat</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-500 text-sm">
                        Click on "Manage Seat" for a student below to open the seat assignment interface.
                    </CardContent>
                </Card>
            )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Student Directory</h2>
        <div className="mb-4">
            <Input 
                placeholder="Search by name or ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
            />
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Seat</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3 font-mono">{student.student_id}</td>
                    <td className="px-4 py-3">
                        {student.route?.name || <span className="text-gray-400">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3">
                        {student.seat_number ? (
                            <span className="font-bold text-green-600">{student.seat_number}</span>
                        ) : (
                            <span className="text-gray-400">-</span>
                        )}
                    </td>
                    <td className="px-4 py-3">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                        >
                            Manage Seat
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
                <div className="p-4 text-center text-gray-500">No students found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
