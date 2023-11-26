import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
import env from "../env";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// @route      /api/user/register
// @desc       register users
// @auth       public
interface registerBody {
  name: string;
  email: string;
  password: string;
}

export const register: RequestHandler<
  unknown,
  unknown,
  registerBody,
  unknown
> = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide all required data" });
    }
    const checkUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (checkUser)
      return res.status(400).json({ msg: "Email is already taken." });

    const salt = bcrypt.genSaltSync(10);
    const Hashpassword = bcrypt.hashSync(password, salt);
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: Hashpassword,
      },
    });

    res.status(201).json({ msg: "Register success" });
  } catch (error) {
    next(error);
  }
};

// @route      /api/user/login
// @desc       login users
// @auth       public

interface loginBody {
  email: string;
  password: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  loginBody,
  unknown
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide all required data" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return res.status(400).json({ msg: "Email is not found." });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password is incorrect" });
    }
    const token = jwt.sign({ id: user.id, name: user.name }, env.SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({
      msg: "Login Successful",
      token: token,
      user:user
    });
  } catch (error) {
    next(error);
  }
};

// @route      /api/user/all
// @desc       get all users
// @auth       public

export const getAllUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany();
    res.status(400).json({ user });
  } catch (error) {
    next(error);
  }
};

// @route      /api/user/
// @desc       test protected route
// @auth       private
export const getUserData: RequestHandler = async (req, res, next) => {
  try {
    const userID = res.locals.user.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      include: {
        device: true,
        Media: true,
        Playlist:true
      },
    });
    if (!user) {
      return res.status(400).json({ msg: "User not  Found" });
    }
    res.status(200).json({ doc: user, msg: "User Found" });
  } catch (error) {
    next(error);
  }
};
