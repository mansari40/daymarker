import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const userId = session.user.id;

  const [today, upcoming, missed, completed, archive] = await Promise.all([
    prisma.task.count({
      where: {
        userId,
        completed: false,
        archived: false,
        OR: [
          { dueDate: null },
          { dueDate: { gte: todayStart, lt: todayEnd } },
        ],
      },
    }),
    prisma.task.count({
      where: {
        userId,
        completed: false,
        archived: false,
        dueDate: { gte: todayEnd },
      },
    }),
    prisma.task.count({
      where: {
        userId,
        completed: false,
        archived: false,
        dueDate: { lt: todayStart },
      },
    }),
    prisma.task.count({
      where: {
        userId,
        completed: true,
        archived: false,
      },
    }),
    prisma.task.count({
      where: {
        userId,
        archived: true,
      },
    }),
  ]);

  return NextResponse.json({ today, upcoming, missed, completed, archive });
}
