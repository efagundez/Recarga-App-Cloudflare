import mongoose from 'mongoose';

const MensajeSchema = new mongoose.Schema({
  id_vendedor: { type: Number, required: true },
  grupo: { type: String, required: true },
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  leido: { type: Boolean, default: false },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Mensaje || mongoose.model('Mensaje', MensajeSchema);
