import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../env";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export interface Iuser {
  id: string;
  name: string;
  lat: number;
  exp: number;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = jwt.verify(token, env.SECRET);

  res.locals.user = decoded;

  next();
};

export default authMiddleware;
