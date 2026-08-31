import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, category, weight, timeOfDay, dueDate } = await req.json();

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        category: category || "OTHER",
        weight: weight || "STEADY",
        timeOfDay: timeOfDay || "ANYTIME",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "today";

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  let where: Record<string, unknown> = {
    userId: session.user.id,
    archived: false,
  };

  if (status === "today") {
    where.completed = false;
    where.OR = [
      { dueDate: null },
      { dueDate: { gte: todayStart, lt: todayEnd } },
    ];
  } else if (status === "upcoming") {
    where.completed = false;
    where.archived = false;
    where.dueDate = { gt: todayEnd };
  } else if (status === "completed") {
    where.completed = true;
    where.archived = false;
  } else if (status === "archive") {
    where.archived = true;
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
  });

  return NextResponse.json(tasks);
}
