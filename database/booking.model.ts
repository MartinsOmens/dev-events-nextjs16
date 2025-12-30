import mongoose, { Schema, Types, type HydratedDocument, type Model } from 'mongoose';
import { EventModel } from './event.model';

export interface Booking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<Booking>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<Booking, Model<Booking>>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // index to speed up queries by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true, // automatically manage createdAt and updatedAt
    strict: true,
  },
);

// Secondary index on eventId in case we need to tune index options later
bookingSchema.index({ eventId: 1 });

// Validate email and referenced event before saving a booking.
bookingSchema.pre<BookingDocument>('save', async function preSave(next) {
  const email = this.email.trim();

  if (!EMAIL_REGEX.test(email)) {
    return next(new Error('Invalid email address'));
  }

  this.email = email.toLowerCase();

  // On new documents or when eventId changes, verify the referenced event exists.
  if (this.isNew || this.isModified('eventId')) {
    try {
      const eventExists = await EventModel.exists({ _id: this.eventId }).lean().exec();

      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch (error) {
      return next(error instanceof Error ? error : new Error('Failed to validate referenced event'));
    }
  }

  next();
});

// Reuse existing model in development to avoid OverwriteModelError
export const BookingModel: Model<Booking> =
  (mongoose.models.Booking as Model<Booking> | undefined) ??
  mongoose.model<Booking>('Booking', bookingSchema);
