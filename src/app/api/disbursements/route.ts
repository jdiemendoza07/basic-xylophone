import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const disbursement = await prisma.disbursementCheck.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    });
    return NextResponse.json(disbursement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create disbursement" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const startDateStr = url.searchParams.get('startDate');
    const endDateStr = url.searchParams.get('endDate');

    let whereClause = {};
    if (startDateStr && endDateStr) {
      whereClause = {
        date: {
          gte: new Date(startDateStr),
          lte: new Date(endDateStr)
        }
      }
    }

    const disbursements = await prisma.disbursementCheck.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
    });
    return NextResponse.json(disbursements);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch disbursements" }, { status: 500 });
  }
}
