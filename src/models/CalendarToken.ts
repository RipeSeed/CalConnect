import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICalendarToken extends Document {
  userId: string;
  google: {
    accessToken: string;
    refreshToken?: string;
    scope: string;
    tokenType: string;
    expiryDate: Date;
    idToken?: string;
  };
  outlook: {
    accessToken: string;
    refreshToken?: string;
    scope: string;
    tokenType: string;
    expiryDate: Date;
    idToken?: string;
  };
  updatedAt: Date;
}

const CalendarTokenSchema = new Schema<ICalendarToken>({
  userId: { type: String, required: true, unique: true },
  google: {
    type: {
      accessToken: { type: String, required: true },
      refreshToken: { type: String },
      scope: { type: String, required: true },
      tokenType: { type: String, required: true },
      expiryDate: { type: Date, required: true },
      idToken: { type: String },
    },
    default: null,
  },
  outlook: {
    type: {
      accessToken: { type: String, required: true },
      refreshToken: { type: String },
      scope: { type: String, required: true },
      tokenType: { type: String, required: true },
      expiryDate: { type: Date, required: true },
      idToken: { type: String },
    },
    default: null,
  },
  updatedAt: { type: Date, default: Date.now },
});

export const CalendarToken: Model<ICalendarToken> =
  mongoose.model<ICalendarToken>('CalendarToken', CalendarTokenSchema);
