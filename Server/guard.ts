import express from "express";
import { Bearer } from "permit";
import jwtSimple from "jwt-simple";
import {env} from "./env"
import { guardService } from "./guardService";

const permit = new Bearer({
  query: "access_token",
});

export async function isLoggedIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
  ) {
  try {
    const token = permit.check(req);
    if (!token) {
      return res.status(200).json({ message: "Permission denied" });
    }
    const payload = jwtSimple.decode(token, env.JWT_SECRET);
    const userId = payload.id;
    const user = await guardService.getUserById(userId);

    req.userId = userId;

    if (user) {
      req.user = user;
      return next();
    } else {
      return res.status(401).json({ message: "Permission Denied" });
    }
    // next();
  } catch (e) {
    return res.status(401).json({ message: e });
  }
}
