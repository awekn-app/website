import mongoose, { Schema, model, models } from 'mongoose';

export interface IWaitlistUser {
  name: string;
  email: string;
  country: string;
  createdAt: Date;
}

const waitlistUserSchema = new Schema<IWaitlistUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const WaitlistUser = models.WaitlistUser || model<IWaitlistUser>('WaitlistUser', waitlistUserSchema);

export default WaitlistUser;
