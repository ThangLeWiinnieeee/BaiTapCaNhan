import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.model';

export interface IUser extends Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  gender: boolean;
  roleId: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  gender: { type: Boolean, default: false },
  roleId: { type: String },
}, {
  timestamps: true,
  toJSON: { virtuals: true }, // Để đảm bảo 'id' ảo được thêm vào
  toObject: { virtuals: true }
});

// Hash password trước khi lưu
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Tạo một trường 'id' ảo từ '_id' để tương thích với view EJS 
UserSchema.virtual('id').get(function (this: IUser) {
  return this._id.toHexString();
});

export default mongoose.model<IUser>('User', UserSchema);