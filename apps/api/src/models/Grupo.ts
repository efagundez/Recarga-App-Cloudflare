import mongoose from 'mongoose';

const GrupoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  estado: { type: String, default: 'ACTIVO' }
}, { timestamps: true });

export default mongoose.models.Grupo || mongoose.model('Grupo', GrupoSchema);
