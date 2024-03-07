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
exports.saveWebhookResponse = void 0;
const webhook_events_1 = __importDefault(require("../model/webhook-events"));
// import Item from '../model/item';
// import  itemSchema  from '../validators/itemValidator';
const saveWebhookResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let data = {
            event: (_a = req.body) === null || _a === void 0 ? void 0 : _a.event,
            meta: req.body
        };
        let webhookResponse = yield webhook_events_1.default.create(data);
        res.status(200).send(req.body);
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.saveWebhookResponse = saveWebhookResponse;
