import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICalendarToken extends Document {
  userId: string;
  accessToken: string;
  refreshToken?: string;
  scope: string;
  tokenType: string;
  expiryDate: Date;
  idToken?: string;
  updatedAt: Date;
}

const CalendarTokenSchema = new Schema<ICalendarToken>({
  userId: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  scope: { type: String, required: true },
  tokenType: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  idToken: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

export const CalendarToken: Model<ICalendarToken> = mongoose.model<ICalendarToken>(
  "CalendarToken",
  CalendarTokenSchema,
);
