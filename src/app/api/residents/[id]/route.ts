import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await req.json();
    const resident = await prisma.resident.update({
      where: { id: (await params).id },
      data: {
        ...data,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        birthDate: new Date(data.birthDate),
      },
    });
    return NextResponse.json(resident);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update resident" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await prisma.resident.delete({
      where: { id: (await params).id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete resident" }, { status: 500 });
  }
}
