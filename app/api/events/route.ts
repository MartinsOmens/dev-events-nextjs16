import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { EventModel, slugify } from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const raw = Object.fromEntries(formData.entries());

    //Parse JSON fields safely

    const eventData = {
      ...raw,
      agenda:
        typeof raw.agenda === "string"
          ? JSON.parse(raw.agenda)
          : raw.agenda || [],
      tags:
        typeof raw.tags === "string" 
        ? JSON.parse(raw.tags) 
        : raw.tags || [],
    };

    // 🔑 generate the SAME slug your model will generate
    const slug = slugify(String(eventData.title));

    const existingEvent = await EventModel.findOne({ slug });

    if (existingEvent) {
      return NextResponse.json(
        { message: "Event already exists", event: existingEvent },
        { status: 409 }
      );
    }

    const createdEvent = await EventModel.create(eventData);

    return NextResponse.json(
      { message: "Event Created Successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: error instanceof Error ? error.message : "Unkown error",
      },
      { status: 500 }
    );
  }
}
