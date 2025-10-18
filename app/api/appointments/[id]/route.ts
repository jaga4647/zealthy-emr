import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = params.id;
  
  try {
    const data = await request.json();

    const updated = await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        provider: data.provider,
        date: new Date(data.date),
        repeat: data.repeat || "none",
        repeatEnd: data.repeatEnd ? new Date(data.repeatEnd) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/appointments/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}