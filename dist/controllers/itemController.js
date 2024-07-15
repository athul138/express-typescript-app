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
exports.jsFunctions = exports.deleteItem = exports.updateItem = exports.getItems = exports.createItem = void 0;
const item_1 = __importDefault(require("../model/item"));
const itemValidator_1 = __importDefault(require("../validators/itemValidator"));
const joi_1 = require("joi");
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
const jsFunctions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { types } = req.body;
        let data = '';
        // let sArray:any =[]
        if (types == 'closure') {
            function init() {
                var name = "Javascript Closure"; // var inside a function.
                function displayName() {
                    console.log("this is ", name); // the variable will get here because its a closure.
                    data = `this is ${name}`;
                }
                displayName(); // this function will be called second
            }
            init(); // init will run first.
        }
        if (types == 'set_time_out') {
            for (let i = 0; i < 4; i++) { //the value of i inside the setTimeout callback will be the value of i at the time the callback was created.
                console.log("first i = ", i);
                setTimeout(() => {
                    console.log(i);
                }, i * 1000);
                console.log("after set timeout i = ", i);
            }
            for (var i = 0; i < 4; i++) { // as var can be accessed from anywhere and set timeount will take time to excecute. the final value of i will be printed ie, 4,4,4,4
                console.log("first i = ", i);
                setTimeout(() => {
                    console.log(i);
                }, i * 1000);
                console.log("after set timeout i = ", i);
            }
        }
        if (types == 'promise') {
            let arr = [1, 2, 3, 4, 5, 5, 4, 4, 3, 3, 2, 2, 2, 4, 6, 7, 87, 6, 7, 8, 8, 9, 5, 3, 3, 2, 7, 6, 5, 4, 3, 2, 2, 2, 2, 4, 6, 7, 8, 2, 9, 6, 5, 4, 3];
            let newSet = arr.map((value) => __awaiter(void 0, void 0, void 0, function* () {
                return value;
            }));
            let newValues = yield Promise.all(newSet).then((values) => {
                return values;
            });
            console.log("newValues-->>>>>", newValues);
        }
        let response = {
            statusCode: 200,
            message: "success response",
            data: data,
            arr: joi_1.array
        };
        res.json(response);
    }
    catch (error) {
        res.status(500).send('Server Error');
    }
});
exports.jsFunctions = jsFunctions;
// for (var i = 0; i < 4; i++) {
//   setTimeout(() => {
//     console.log(i)
//   }, i * 1000)
//   const myArray: any = ["zero", "one", "two"];
//   myArray.myMethod = function (sProperty: any) {
//     console.log(arguments.length > 0 ? this[sProperty] : this);
//   };
//   setTimeout(myArray.myMethod, 1.0 * 1000);
//   setTimeout(myArray.myMethod, 1.5 * 1000, "1");
// }
// let x = 5;
// {
//   let x = 8
//   console.log(x);
// }
