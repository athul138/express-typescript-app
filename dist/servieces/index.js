"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require('bcrypt');
module.exports = {
    hashPassword: (password) => {
        if (password) {
            const saltRounds = 10;
            return bcrypt.hash(password, saltRounds);
        }
        else
            false;
    },
    matchPassword: (currentPassword, incomingPassword) => __awaiter(void 0, void 0, void 0, function* () {
        const match = yield bcrypt.compare(incomingPassword, currentPassword);
        return match;
    }),
};
