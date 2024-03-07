"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/itemRoutes.ts
const express = require('express');
const itemController_1 = require("../controllers/itemController");
const router = express.Router();
const multer = require('multer');
// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Rename the file to include the timestamp
    },
});
const upload = multer({ storage: storage });
router.post('/', upload.array('images'), itemController_1.createItem);
router.get('/', itemController_1.getItems);
router.put('/:id', itemController_1.updateItem);
router.delete('/:id', itemController_1.deleteItem);
exports.default = router;
