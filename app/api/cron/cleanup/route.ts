import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const cutoff = new Date(Date.now() - TWO_DAYS_MS);

    const result = await prisma.ticket.deleteMany({
      where: {
        eventDate: { lt: cutoff },
      },
    });

    return NextResponse.json({ deleted: result.count });
  } catch (error) {
    console.error("Cleanup cron error:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
