import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  id_vendedor: { type: String, required: true, unique: true },
  grupo: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  saldo: { type: Number, default: 1000 },
  name: { type: String },
  email: { type: String },
  role: { type: String, enum: ['ADMIN', 'CLIENT', 'DISTRIBUTOR'], default: 'CLIENT' },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
