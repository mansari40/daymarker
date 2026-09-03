import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { createdAt: true },
  });

  const totalCompleted = await prisma.task.count({
    where: {
      userId: session.user.id,
      completed: true,
    },
  });

  return NextResponse.json({
    memberSince: user?.createdAt ?? null,
    totalCompleted,
  });
}
