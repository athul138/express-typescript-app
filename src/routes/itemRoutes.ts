// routes/itemRoutes.ts
const express = require('express');
import { createItem, getItems, updateItem, deleteItem } from '../controllers/itemController';
const router = express.Router();
const multer = require('multer');

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, Date.now() + '-' + file.originalname); // Rename the file to include the timestamp
    },
});
const upload = multer({ storage: storage });

router.post('/', upload.array('images'), createItem);
router.get('/', getItems);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
