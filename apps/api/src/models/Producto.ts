import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  id_producto: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  operadora: { type: String, required: true },
  monto_minimo: { type: Number, default: 0 },
  monto_maximo: { type: Number, default: 0 },
  multiplo: { type: Number, default: 1 },
  maximo_diario_tlf: { type: Number, default: 0 },
  maximo_mensual_tlf: { type: Number, default: 0 },
  limites: { type: String },
  estado: { type: String, default: 'ACTIVO' }
}, { timestamps: true });

export default mongoose.models.Producto || mongoose.model('Producto', ProductoSchema);
