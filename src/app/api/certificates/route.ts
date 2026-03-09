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
    const certificate = await prisma.certificate.create({
      data: {
        ...data,
      },
    });
    return NextResponse.json(certificate);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 });
  }
}
