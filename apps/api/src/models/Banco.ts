import mongoose from 'mongoose';

const BancoSchema = new mongoose.Schema({
  id_banco: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  codigo_banco: { type: String },
  num_cuenta: { type: String },
  titular: { type: String },
  rif_cedula: { type: String },
  tipo_cuenta: { type: String },
  estado: { type: String, default: 'ACTIVO' }
}, { timestamps: true });

export default mongoose.models.Banco || mongoose.model('Banco', BancoSchema);
