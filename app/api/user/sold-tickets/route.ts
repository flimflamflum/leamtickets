import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ count: 0, hasSold: false });
  }

  const count = await prisma.ticket.count({
    where: {
      sellerId: session.user.id,
      status: "SOLD",
    },
  });

  return Response.json({
    count,
    hasSold: count > 0,
  });
}
