import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const disbursement = await prisma.disbursementCheck.findUnique({
      where: { id },
    });
    if (!disbursement) {
      return NextResponse.json({ error: "Disbursement not found" }, { status: 404 });
    }
    return NextResponse.json(disbursement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch disbursement" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await req.json();
    const disbursement = await prisma.disbursementCheck.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
    return NextResponse.json(disbursement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update disbursement" }, { status: 500 });
  }
}
