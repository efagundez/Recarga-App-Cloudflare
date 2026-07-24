import mongoose from 'mongoose';

const RechargeSchema = new mongoose.Schema({
  nro_transaccion: {
    type: String,
    required: true,
    unique: true,
  },
  id_vendedor: {
    type: String,
    required: true,
  },
  id_producto: {
    type: String,
    required: true,
  },
  producto: {
    type: String,
  },
  cuenta: {
    type: String,
    required: true,
  },
  monto: {
    type: Number,
    required: true,
  },
  grupo: {
    type: String,
    required: true,
  },
  resultado: {
    type: String,
    default: 'EXITOSA',
  },
  error: {
    type: String,
    default: '',
  },
  fecha: {
    type: String,
  },
  hora: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.models.Recharge || mongoose.model('Recharge', RechargeSchema);
