import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "./service";
import { auth } from "@/auth";
import { createNotificationSchema } from "./notification.Schema";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await NotificationService.getAll(session.user.id);
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    // Only admins or the system should be able to create notifications
    // For now, let's just check if it's authenticated or handle admin logic
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = createNotificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const result = await NotificationService.create(validation.data);

    if (!result.success) {
      return NextResponse.json({ error: "Failed to create notification" }, { status: 400 });
    }

    return NextResponse.json(result.notification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
