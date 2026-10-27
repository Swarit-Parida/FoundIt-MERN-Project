import mongoose from 'mongoose';
const claimSchema = new mongoose.Schema({
  claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  type: { type: String, required: true, enum: ['LOST', 'FOUND'] },
  category: { type: String, required: true, enum: ['Electronics','Bags & Wallets','Keys','ID Cards','Books & Notes','Clothing','Accessories','Other'] },
  description: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  location: { type: String, required: true, trim: true, maxlength: 120 },
  dateLostFound: { type: Date, required: true, validate: { validator: value => value <= new Date(), message: 'The item date cannot be in the future.' } },
  imageUrl: { type: String, trim: true, default: '', maxlength: 1000, validate: { validator: value => !value || /^https?:\/\//i.test(value), message: 'Image URL must start with http:// or https://.' } },
  status: { type: String, enum: ['OPEN', 'CLAIMED', 'RETURNED'], default: 'OPEN' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claims: { type: [claimSchema], default: [] }
}, { timestamps: true });
itemSchema.index({ title: 'text', description: 'text', location: 'text' });
itemSchema.index({ type: 1, category: 1, status: 1, createdAt: -1 });
export default mongoose.model('Item', itemSchema);
