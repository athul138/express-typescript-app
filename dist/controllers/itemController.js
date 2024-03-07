"use strict";
// controllers/itemController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.getItems = exports.createItem = void 0;
const item_1 = __importDefault(require("../model/item"));
const itemValidator_1 = __importDefault(require("../validators/itemValidator"));
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = itemValidator_1.default.validate(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        let data = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        };
        if (req.files.length > 0) {
            data.images = req.files;
        }
        const newItem = yield item_1.default.create(data);
        res.json(newItem);
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.createItem = createItem;
const getItems = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield item_1.default.find();
        res.json(items);
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.getItems = getItems;
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { error } = itemValidator_1.default.validate(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const updatedItem = yield item_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedItem)
            return res.status(404).send('Item not found');
        res.json(updatedItem);
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.updateItem = updateItem;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedItem = yield item_1.default.findByIdAndDelete(id);
        if (!deletedItem)
            return res.status(404).send('Item not found');
        res.json(deletedItem);
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.deleteItem = deleteItem;
