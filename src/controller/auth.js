import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";
import { message } from "antd";

export const register = async (req, res) => {
  try {
    //code
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // res.status(201).json({ id: user.id, username, email });
    res.status(201).json({ message: "register successed !!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          username ? { username } : undefined,
        ].filter(Boolean),
      },
    });

    if (!user) return res.status(401).json({ message: "Invalid" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getprofile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        wallets: {
          include: {
            asset: {
              select: { id: true, symbol: true, name: true },
            },
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "Not found" });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        wallets: user.wallets,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
