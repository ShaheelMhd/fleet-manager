# Seat Allocation Algorithm

The seat allocation logic is primarily enforced in the backend API at `app/api/assign-seat/route.ts`.

## Core Rules

1.  **Capacity Check**:
    Before assigning a seat, the system checks the assigned bus's capacity for the given route.
    ```typescript
    if (seatNumber > route.bus.capacity) {
        throw new Error("Seat number exceeds bus capacity");
    }
    ```

2.  **Uniqueness Check**:
    The system queries the database to ensure no other student on the *same route* has the *same seat number*.
    ```typescript
    const existingStudent = await supabase
        .from("students")
        .select("id")
        .eq("route_id", routeId)
        .eq("seat_number", seatNumber)
        .single();
    
    if (existingStudent) {
        throw new Error("Seat is already occupied");
    }
    ```
    *Note: This is also enforced at the database level via a unique constraint:*
    ```sql
    constraint unique_seat_per_route unique (route_id, seat_number)
    ```

3.  **Bus Assignment Check**:
    A seat cannot be assigned if the route does not have a bus assigned.

## Workflow

1.  Manager selects a student.
2.  Frontend fetches the Student's Route.
3.  Frontend fetches the Route's assigned Bus (to get capacity).
4.  Frontend fetches all currently occupied seat numbers for that Route.
5.  Frontend renders the `SeatMap`:
    -   Generates a grid of seats from 1 to `capacity`.
    -   Disables buttons for `occupiedSeats`.
6.  Manager clicks an available seat.
7.  Frontend sends `POST /api/assign-seat` with `{ studentId, routeId, seatNumber }`.
8.  Backend validates rules (1-3) again to prevent race conditions.
9.  If valid, Student record is updated.
