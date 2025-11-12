import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
  email: string;
  password?: string; // ? (optional) và select: false để không trả về
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  gender: boolean;
  roleId: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // select: false để không trả về password khi query
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  gender: { type: Boolean, default: false },
  roleId: { type: String },
}, {
  timestamps: true,
  toJSON: { virtuals: true }, // Đảm bảo 'id' ảo được thêm vào khi .toJSON()
  toObject: { virtuals: true }
});

UserSchema.pre<IUser>('save', async function (next) {
  // Chỉ hash password nếu nó được thay đổi (hoặc là mới)
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

UserSchema.virtual('id').get(function (this: IUser) {
  return this._id.toHexString();
});

export default mongoose.model<IUser>('User', UserSchema);