import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

// Event entity shape used throughout the app
export interface Event {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // stored as ISO-8601 date (YYYY-MM-DD)
  time: string; // stored as 24h time (HH:mm)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = HydratedDocument<Event>;

// Helper to generate a URL-safe slug from the event title
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Basic string non-empty validator
const isNonEmptyString = (value: string): boolean =>
  typeof value === "string" && value.trim().length > 0;

const eventSchema = new Schema<Event, Model<Event>>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Title must not be empty",
      },
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Description must not be empty",
      },
    },
    overview: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Overview must not be empty",
      },
    },
    image: { type: String, required: true, trim: true, validate: { validator: isNonEmptyString, message: "Image URL must not be empty" } },
    venue: { type: String, required: true, trim: true, validate: { validator: isNonEmptyString, message: "Venue must not be empty" } },
    location: { type: String, required: true, trim: true, validate: { validator: isNonEmptyString, message: "Location must not be empty" } },
    date: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => !isNaN(new Date(value).getTime()),
        message: "Invalid date format; expected a parsable date string",
      },
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          const m = /^(?<hour>\d{1,2}):(?<minute>\d{2})$/.exec(value.trim());
          if (!m?.groups) return false;
          const h = Number(m.groups.hour);
          const min = Number(m.groups.minute);
          return h >= 0 && h <= 23 && min >= 0 && min <= 59;
        },
        message: "Invalid time format; expected HH:mm",
      },
    },
    mode: { type: String, required: true, trim: true, validate: { validator: isNonEmptyString, message: "Mode must not be empty" } },
    audience: { type: String, required: true, trim: true, validate: { validator: isNonEmptyString, message: "Audience must not be empty" } },
    agenda: { type: [String], required: true, validate: { validator: (arr: string[]) => arr.length > 0 && arr.every(isNonEmptyString), message: "Agenda must contain at least one non-empty item" } },
    organizer: { type: String, required: true, trim: true, validate: { validator: isNonEmptyString, message: "Organizer must not be empty" } },
    tags: { type: [String], required: true, validate: { validator: (arr: string[]) => arr.length > 0 && arr.every(isNonEmptyString), message: "Tags must contain at least one non-empty tag" } },
  },
  { timestamps: true, strict: true }
);

// Ensure slug has unique index
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-validate middleware:
 *  - Generate slug if missing
 *  - Normalize date to YYYY-MM-DD
 *  - Normalize time to HH:mm
 */
eventSchema.pre<EventDocument>("validate", function () {
  // Generate slug if missing
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }

  // Normalize date
  if (this.date) {
    const d = new Date(this.date);
    if (isNaN(d.getTime())) {
      throw new Error("Invalid date format");
    }
    this.date = d.toISOString().slice(0, 10);
  }

  // Normalize time
  if (this.time) {
    const m = /^(?<hour>\d{1,2}):(?<minute>\d{2})$/.exec(this.time.trim());
    if (!m?.groups) {
      throw new Error("Invalid time format");
    }

    const h = Number(m.groups.hour);
    const min = Number(m.groups.minute);

    if (h < 0 || h > 23 || min < 0 || min > 59) {
      throw new Error("Invalid time value");
    }

    this.time = `${h.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}`;
  }
});


// Reuse existing model in development
export const EventModel: Model<Event> =
  (mongoose.models.Event as Model<Event> | undefined) ?? mongoose.model<Event>("Event", eventSchema);
