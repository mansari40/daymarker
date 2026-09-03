import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: "month query param required (YYYY-MM)" },
      { status: 400 }
    );
  }

  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;

  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 1);

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      archived: false,
      dueDate: {
        gte: monthStart,
        lt: monthEnd,
      },
    },
    select: {
      id: true,
      title: true,
      category: true,
      weight: true,
      timeOfDay: true,
      dueDate: true,
    },
    orderBy: [{ timeOfDay: "asc" }, { sortOrder: "asc" }],
  });

  const grouped: Record<string, typeof tasks> = {};
  for (const task of tasks) {
    if (!task.dueDate) continue;
    const key = task.dueDate.toISOString().split("T")[0];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(task);
  }

  return NextResponse.json(grouped);
}
