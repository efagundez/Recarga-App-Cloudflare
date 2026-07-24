import mongoose from 'mongoose';

const TransaccionCuentaSchema = new mongoose.Schema({
  id_vendedor: { type: Number, required: true },
  grupo: { type: String, required: true },
  cuenta: { type: String, required: true }, // teléfono o número de cuenta
  tipo: { type: String, enum: ['RECARGA', 'DEPOSITO', 'AJUSTE', 'COMISION'], required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  descripcion: { type: String },
  referencia: { type: String }
}, { timestamps: true });

export default mongoose.models.TransaccionCuenta || mongoose.model('TransaccionCuenta', TransaccionCuentaSchema);
