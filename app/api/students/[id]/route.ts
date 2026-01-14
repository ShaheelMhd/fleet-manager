import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";
import { studentSchema } from "../../schema";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const body = await req.json();
        const result = studentSchema.partial().safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.flatten() },
                { status: 400 }
            );
        }

        // Only update allowed fields
        const { data, error } = await supabase
            .from("students")
            .update(result.data)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const { error } = await supabase.from("students").delete().eq("id", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Student deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
