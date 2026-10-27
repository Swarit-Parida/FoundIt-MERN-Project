import { Router } from 'express';
import { listItems, getItem, createItem, myItems, deleteItem, updateItemStatus, createClaim, updateClaim } from '../controllers/itemController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.get('/', listItems); router.get('/mine', protect, myItems); router.post('/', protect, createItem); router.get('/:id', getItem); router.delete('/:id', protect, deleteItem); router.patch('/:id/status', protect, updateItemStatus); router.post('/:id/claims', protect, createClaim); router.patch('/:id/claims/:claimId', protect, updateClaim);
export default router;
