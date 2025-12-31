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
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes

// Basic string non-empty validator reused for multiple fields
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
      index: true, // index to support fast lookups and enforce uniqueness
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
    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Image URL must not be empty",
      },
    },
    venue: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Venue must not be empty",
      },
    },
    location: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Location must not be empty",
      },
    },
    date: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string): boolean => {
          const parsedDate = new Date(value);
          return !Number.isNaN(parsedDate.getTime());
        },
        message: "Invalid date format; expected a parsable date string",
      },
    },
    time: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value: string): boolean => {
          const timeMatch = /^(?<hour>\d{1,2}):(?<minute>\d{2})$/.exec(
            value.trim()
          );
          if (!timeMatch?.groups) return false;
          const hour = Number(timeMatch.groups.hour);
          const minute = Number(timeMatch.groups.minute);
          return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
        },
        message: "Invalid time format; expected HH:mm (24-hour)",
      },
    },
    mode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Mode must not be empty",
      },
    },
    audience: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Audience must not be empty",
      },
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every(isNonEmptyString),
        message: "Agenda must contain at least one non-empty item",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isNonEmptyString,
        message: "Organizer must not be empty",
      },
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every(isNonEmptyString),
        message: "Tags must contain at least one non-empty tag",
      },
    },
  },
  {
    timestamps: true, // automatically manage createdAt and updatedAt
    strict: true,
  }
);

// Ensure slug has a unique index at the database level
eventSchema.index({ slug: 1 }, { unique: true });

// Normalize date and time + generate slug before saving
// This runs for both inserts and updates via save(), but not for updateOne/findOneAndUpdate.
eventSchema.pre<EventDocument>("save", function preSave(next) {
  // Only regenerate slug when the title changes to keep existing URLs stable.
  if (this.isModified("title")) {
    this.slug = slugify(this.title);
  }

  // Normalize date to ISO format (YYYY-MM-DD).
  if (this.isModified("date")) {
    const parsedDate = new Date(this.date);

    if (Number.isNaN(parsedDate.getTime())) {
      return next(
        new Error("Invalid date format; expected a parsable date string")
      );
    }

    this.date = parsedDate.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  // Normalize time to 24-hour HH:mm format.
  if (this.isModified("time")) {
    const timeString = this.time.trim();
    // Accepts `H:mm` or `HH:mm` and normalizes to `HH:mm`.
    const timeMatch = /^(?<hour>\d{1,2}):(?<minute>\d{2})$/.exec(timeString);

    if (!timeMatch || !timeMatch.groups) {
      return next(new Error("Invalid time format; expected HH:mm (24-hour)"));
    }

    const hour = Number(timeMatch.groups.hour);
    const minute = Number(timeMatch.groups.minute);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return next(
        new Error("Invalid time value; hour must be 0-23 and minute 0-59")
      );
    }

    this.time = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  }

  // Extra defensive check for critical required fields being non-empty.
  const requiredStrings: Array<keyof Event> = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredStrings) {
    const value = this[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      return next(
        new Error(`Field "${String(field)}" is required and must not be empty`)
      );
    }
  }

  if (!Array.isArray(this.agenda) || this.agenda.length === 0) {
    return next(
      new Error("Agenda is required and must contain at least one item")
    );
  }

  if (!Array.isArray(this.tags) || this.tags.length === 0) {
    return next(
      new Error("Tags are required and must contain at least one tag")
    );
  }

  next();
});

// Reuse existing model in development to avoid OverwriteModelError
export const EventModel: Model<Event> =
  (mongoose.models.Event as Model<Event> | undefined) ??
  mongoose.model<Event>("Event", eventSchema);
