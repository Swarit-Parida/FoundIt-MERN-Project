import mongoose from 'mongoose';
import Item from '../models/Item.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const categories = ['Electronics','Bags & Wallets','Keys','ID Cards','Books & Notes','Clothing','Accessories','Other'];
const populateItem = query => query.populate('owner','name email').populate('claims.claimant','name email');
export const listItems = asyncHandler(async (req, res) => {
  const { search = '', type = 'ALL', category = '', sort = 'newest' } = req.query;
  const filter = { status: { $ne: 'RETURNED' } };
  if (['LOST','FOUND'].includes(type)) filter.type = type;
  if (category && categories.includes(category)) filter.category = category;
  const term = String(search).trim().slice(0, 100);
  if (term) { const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); filter.$or = [{ title: { $regex: escaped, $options: 'i' } }, { description: { $regex: escaped, $options: 'i' } }, { location: { $regex: escaped, $options: 'i' } }]; }
  const items = await populateItem(Item.find(filter).sort({ createdAt: sort === 'oldest' ? 1 : -1 }).limit(100));
  res.json({ count: items.length, items });
});
export const getItem = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid listing ID.' });
  const item = await populateItem(Item.findById(req.params.id));
  if (!item) return res.status(404).json({ message: 'Listing not found.' });
  res.json({ item });
});
export const createItem = asyncHandler(async (req, res) => {
  const { title, type, category, description, location, dateLostFound, imageUrl = '' } = req.body;
  if (![title,type,category,description,location,dateLostFound].every(v => typeof v === 'string' && v.trim())) return res.status(400).json({ message: 'Please complete all required fields.' });
  if (!['LOST','FOUND'].includes(type)) return res.status(400).json({ message: 'Choose either Lost or Found.' });
  if (!categories.includes(category)) return res.status(400).json({ message: 'Choose a valid category.' });
  if (title.trim().length < 3 || title.trim().length > 100) return res.status(400).json({ message: 'Title must be between 3 and 100 characters.' });
  if (description.trim().length < 10 || description.trim().length > 1000) return res.status(400).json({ message: 'Description must be between 10 and 1000 characters.' });
  if (location.trim().length > 120) return res.status(400).json({ message: 'Location must be at most 120 characters.' });
  const date = new Date(dateLostFound);
  if (Number.isNaN(date.getTime()) || date > new Date()) return res.status(400).json({ message: 'Enter a valid date that is not in the future.' });
  if (imageUrl !== undefined && imageUrl !== null && typeof imageUrl !== 'string') return res.status(400).json({ message: 'Image URL must be text.' });
  const normalizedImageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : '';
  if (normalizedImageUrl && (normalizedImageUrl.length > 1000 || !/^https?:\/\//i.test(normalizedImageUrl))) return res.status(400).json({ message: 'Image URL must be a valid public HTTP or HTTPS URL.' });
  const item = await Item.create({ title: title.trim(), type, category, description: description.trim(), location: location.trim(), dateLostFound: date, imageUrl: normalizedImageUrl, owner: req.user._id });
  res.status(201).json({ message: 'Listing published.', item: await populateItem(Item.findById(item._id)) });
});
export const myItems = asyncHandler(async (req, res) => {
  const items = await populateItem(Item.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(100));
  res.json({ count: items.length, items });
});
export const deleteItem = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid listing ID.' });
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Listing not found.' });
  if (!item.owner.equals(req.user._id)) return res.status(403).json({ message: 'Only the listing owner can delete this listing.' });
  await item.deleteOne(); res.json({ message: 'Listing deleted.' });
});
export const updateItemStatus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid listing ID.' });
  if (req.body.status !== 'RETURNED') return res.status(400).json({ message: 'Only marking an item as returned is supported.' });
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Listing not found.' });
  if (!item.owner.equals(req.user._id)) return res.status(403).json({ message: 'Only the listing owner can change this status.' });
  if (item.status === 'RETURNED') return res.status(409).json({ message: 'This item has already been marked returned.' });
  if (item.type === 'FOUND' && !item.claims.some(c => c.status === 'APPROVED')) return res.status(400).json({ message: 'Approve a claim before marking this found item as returned.' });
  item.status = 'RETURNED'; await item.save();
  res.json({ message: 'Item marked as returned. Thanks for helping it find its way home!', item: await populateItem(Item.findById(item._id)) });
});
export const createClaim = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid listing ID.' });
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  if (message.length < 10 || message.length > 500) return res.status(400).json({ message: 'Claim message must be between 10 and 500 characters.' });
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Listing not found.' });
  if (item.owner.equals(req.user._id)) return res.status(403).json({ message: 'You cannot claim your own listing.' });
  if (item.type !== 'FOUND') return res.status(400).json({ message: 'Claims are only available for found-item listings. If you found this lost item, create a found listing.' });
  if (item.status !== 'OPEN') return res.status(409).json({ message: 'This item is no longer open for claims.' });
  if (item.claims.some(c => c.claimant.equals(req.user._id))) return res.status(409).json({ message: 'You have already submitted a claim for this item.' });
  item.claims.push({ claimant: req.user._id, message }); await item.save();
  res.status(201).json({ message: 'Claim sent to the listing owner.', item: await populateItem(Item.findById(item._id)) });
});
export const updateClaim = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.params.claimId)) return res.status(400).json({ message: 'Invalid listing or claim ID.' });
  const { status } = req.body;
  if (!['APPROVED','REJECTED'].includes(status)) return res.status(400).json({ message: 'Claim status must be APPROVED or REJECTED.' });
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Listing not found.' });
  if (!item.owner.equals(req.user._id)) return res.status(403).json({ message: 'Only the listing owner can review claims.' });
  if (item.status !== 'OPEN') return res.status(409).json({ message: 'This listing is no longer open for claim review.' });
  const claim = item.claims.id(req.params.claimId);
  if (!claim) return res.status(404).json({ message: 'Claim not found.' });
  if (claim.status !== 'PENDING') return res.status(409).json({ message: 'This claim has already been reviewed.' });
  if (status === 'APPROVED') { item.claims.forEach(c => { if (c._id.toString() !== claim._id.toString() && c.status === 'PENDING') c.status = 'REJECTED'; }); item.status = 'CLAIMED'; }
  claim.status = status; await item.save();
  res.json({ message: status === 'APPROVED' ? 'Claim approved. Coordinate a safe handover.' : 'Claim rejected.', item: await populateItem(Item.findById(item._id)) });
});
