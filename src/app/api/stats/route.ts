import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { computeStreak } from "@/lib/streak";

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

  // Today's tasks
  const todayTasks = await prisma.task.findMany({
    where: {
      userId,
      archived: false,
      OR: [
        { dueDate: null },
        { dueDate: { gte: todayStart, lt: todayEnd } },
      ],
    },
    select: { completed: true },
  });

  const todayTotal = todayTasks.length;
  const todayDone = todayTasks.filter((t) => t.completed).length;

  // Streak + week
  const { streak, week } = await computeStreak(userId);

  return NextResponse.json({
    todayDone,
    todayTotal,
    streak,
    week,
  });
}
