import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await req.json();
    const disbursement = await prisma.disbursementCheck.update({
      where: { id: (await params).id },
      data: {
        ...data,
        id: undefined,
        createdAt: undefined,
        date: new Date(data.date),
      },
    });
    return NextResponse.json(disbursement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update disbursement" }, { status: 500 });
  }
}
