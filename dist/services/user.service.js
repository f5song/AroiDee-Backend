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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.registerUser = exports.getAllUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมด
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.users.findMany();
});
exports.getAllUsers = getAllUsers;
// ฟังก์ชันสร้างผู้ใช้ใหม่
const registerUser = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // ตรวจสอบว่า username หรือ email ซ้ำหรือไม่
    const existingUser = yield db_1.default.users.findFirst({
        where: { OR: [{ username }, { email }] },
    });
    if (existingUser) {
        throw new Error("Username or Email already exists");
    }
    // แฮชรหัสผ่าน
    const saltRounds = 10;
    const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
    // สร้างผู้ใช้ใหม่
    const newUser = yield db_1.default.users.create({
        data: {
            username,
            email,
            password_hash: passwordHash,
        },
    });
    return newUser;
});
exports.registerUser = registerUser;
const updateUser = (userId, username, email) => __awaiter(void 0, void 0, void 0, function* () {
    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const user = yield db_1.default.users.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error("User not found");
    }
    // อัปเดตข้อมูล
    const updatedUser = yield db_1.default.users.update({
        where: { id: userId },
        data: {
            username: username || user.username, // ถ้าไม่ได้ส่ง username มาให้ใช้ค่าเดิม
            email: email || user.email, // ถ้าไม่ได้ส่ง email มาให้ใช้ค่าเดิม
        },
    });
    return updatedUser;
});
exports.updateUser = updateUser;
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.users.delete({
        where: { id: userId },
    });
});
exports.deleteUser = deleteUser;
