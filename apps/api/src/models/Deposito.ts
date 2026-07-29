import mongoose from 'mongoose';

const DepositoSchema = new mongoose.Schema({
  id_vendedor: { type: Number, required: true },
  grupo: { type: String, required: true },
  fecha: { type: String, required: true }, // Format YYYY-MM-DD or ISO
  id_banco: { type: String, required: true },
  nro_deposito: { type: String, required: true },
  monto: { type: Number, required: true },
  estado: { 
    type: String, 
    enum: ['En Tránsito', 'Conciliado', 'Rechazado'], 
    default: 'En Tránsito' 
  },
  observacion: { type: String }
}, { timestamps: true });

export default mongoose.models.Deposito || mongoose.model('Deposito', DepositoSchema);
