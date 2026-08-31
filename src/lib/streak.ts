import { prisma } from "@/lib/prisma";

interface StreakResult {
  streak: number;
  week: { day: string; done: number }[];
}

export async function computeStreak(userId: string): Promise<StreakResult> {
  const now = new Date();

  // Get all completed tasks in the last 60 days
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const completedTasks = await prisma.task.findMany({
    where: {
      userId,
      completed: true,
      completedAt: { gte: sixtyDaysAgo },
    },
    select: { completedAt: true },
  });

  // Group by day (YYYY-MM-DD)
  const completedDays = new Set<string>();
  for (const task of completedTasks) {
    if (task.completedAt) {
      const day = task.completedAt.toISOString().split("T")[0];
      completedDays.add(day);
    }
  }

  // Compute streak (count backwards from today)
  let streak = 0;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const checkDate = new Date(today);
  while (true) {
    const key = checkDate.toISOString().split("T")[0];
    if (completedDays.has(key)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Compute this week (Tue–Mon per spec)
  // Find the most recent Tuesday
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // Convert to: Tue=0, Wed=1, Thu=2, Fri=3, Sat=4, Sun=5, Mon=6
  const tuesdayOffset = dayOfWeek === 0 ? 5 : dayOfWeek === 1 ? 6 : dayOfWeek - 2;

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - tuesdayOffset);

  const dayNames = ["Tu", "We", "Th", "Fr", "Sa", "Su", "Mo"];
  const week: { day: string; done: number }[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    week.push({
      day: dayNames[i],
      done: completedDays.has(key) ? 1 : 0,
    });
  }

  return { streak, week };
}
