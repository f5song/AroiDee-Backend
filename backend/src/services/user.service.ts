import prisma from "../config/db";
import bcrypt from "bcrypt";

// ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมด
export const getAllUsers = async () => {
  return await prisma.users.findMany();
};

// ฟังก์ชันสร้างผู้ใช้ใหม่
export const registerUser = async (username: string, email: string, password: string) => {
  // ตรวจสอบว่า username หรือ email ซ้ำหรือไม่
  const existingUser = await prisma.users.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existingUser) {
    throw new Error("Username or Email already exists");
  }

  // แฮชรหัสผ่าน
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // สร้างผู้ใช้ใหม่
  const newUser = await prisma.users.create({
    data: {
      username,
      email,
      password_hash: passwordHash,
    },
  });

  return newUser;
};

export const updateUser = async (userId: number, username?: string, email?: string) => {
  // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
  const user = await prisma.users.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  // อัปเดตข้อมูล
  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      username: username || user.username, // ถ้าไม่ได้ส่ง username มาให้ใช้ค่าเดิม
      email: email || user.email, // ถ้าไม่ได้ส่ง email มาให้ใช้ค่าเดิม
    },
  });

  return updatedUser;
};

export const deleteUser = async (userId: number) => {
  return await prisma.users.delete({
    where: { id: userId },
  });
};
