import { PrismaClient, User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ApiError from "../Utils/apiError.js";
import { JwtPayload } from "jsonwebtoken";
import sendEmail from "../Utils/sendEmail.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../Utils/jwtToken.js";
import {
  storeRefreshToken,
  removeRefreshToken,
  getRefreshToken,
} from "../Utils/redis.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../Utils/setCookie.js";

const prisma = new PrismaClient();

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, phoneNumber } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return next(
        new ApiError(`User with email: ${email} already exists`, 400)
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword, phoneNumber },
    });

    // geerate jwt
    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    // store refresh token on redis (upstash)
    await storeRefreshToken(newUser.id, refreshToken);

    // set cookies
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: newUser,
      token: accessToken,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return next(new ApiError("Signup error", 500));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new ApiError("Invalid email or password", 404));
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new ApiError("Invalid email or password", 400));
    }

    // generate JWT
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // store refresh token on redis (upstash)
    await storeRefreshToken(user.id, refreshToken);

    // set cookies
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token: accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return next(new ApiError("Login error", 500));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

    if (!SECRET_KEY) {
      throw new ApiError(
        "JWT_REFRESH_SECRET_KEY is not defined in .env file",
        500
      );
    }

    // remove refresh token from redis
    if (req.cookies && req.cookies.refreshToken) {
      const decoded = await verifyToken(req.cookies.refreshToken, SECRET_KEY);

      // Check if decoded is a JwtPayload object
      if (typeof decoded !== "string" && (decoded as JwtPayload).userId) {
        await removeRefreshToken((decoded as JwtPayload).userId);
      } else {
        // Handle error or invalid token case
        console.error("Invalid token: no userId found");
      }
    }

    // remove tokens from cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    throw next(new ApiError("Error logging out user", 500));
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // Check if refresh token exists in cookies
    if (!refreshToken) {
      return next(new ApiError("No refresh token provided", 404));
    }

    const SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

    if (!SECRET_KEY) {
      throw new ApiError(
        "JWT_REFRESH_SECRET_KEY is not defined in .env file",
        500
      );
    }

    // Verify and decode the token
    const decoded = await verifyToken(refreshToken, SECRET_KEY);
    const { userId, exp } = decoded as JwtPayload;

    // Check if decoded is a JwtPayload and contains a userId
    if (typeof decoded !== "string" && decoded.userId) {
      // Retrieve the refresh token from Redis
      const storedRefresh = await getRefreshToken(userId);

      if (!storedRefresh || storedRefresh !== refreshToken) {
        return next(new ApiError("Invalid refresh token", 401));
      }

      // Check if the refresh token is expired
      if (exp && exp * 1000 < Date.now()) {
        return next(
          new ApiError("Refresh token expired. Please login again", 401)
        );
      }

      // Generate a new access token using the userId
      const accessToken = generateAccessToken(userId);

      // Set the new access token in cookies
      setAccessTokenCookie(res, accessToken);

      res
        .status(200)
        .json({ status: "success", message: "Token refreshed successfully" });
    } else {
      // If token is invalid or no userId is found
      return next(new ApiError("Invalid token: no userId found", 401));
    }
  } catch (error) {
    // Properly handle errors
    return next(new ApiError("Error with refresh token", 500));
  }
};

// // forgotPassword
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check user
  const user = req.user;
  if (!user) {
    throw new ApiError("No logged user found", 500);
  }
  // generate reset code
  const random = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCode = crypto.createHash("sha256").update(random).digest("hex");

  // 3) Save the reset code in the database
  const updatedUser = await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      passResetCode: resetCode,
      passResetCodeEat: `${Date.now() + 10 * 60 * 1000}`,
      passResetCodeVerified: false,
    },
  });

  if (!user) {
    throw next(new ApiError("Invalid email or password", 404));
  }

  // Email Options
  const options = {
    email: user.email,
    subject: `Password reset code (valid for 10 mins)`,
    message: `Hi ${user.username},\nWe sent the code ${resetCode} to reset your password.\n\nThe Baraka Limited family`,
  };

  // Sending Email
  try {
    await sendEmail(options);
  } catch (err) {
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        passResetCode: undefined,
        passResetCodeEat: undefined,
        passResetCodeVerified: false,
      },
    });

    throw next(new ApiError(`${err}`, 500));
  }

  res.status(200).json({
    status: "success",
    message: `Reset Code was sent successfully to ${user.email}`,
  });
};

// verifyResetCode
export const verifyResetCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passResetCode: code,
      passResetCodeEat: { gt: `${Date.now()}` },
    },
  });

  if (!user) throw new ApiError("Invalid or expired password reset code", 400);

  await prisma.user.update({
    where: { id: user.id },
    data: { passResetCodeVerified: true },
  });

  res
    .status(200)
    .json({ success: true, message: "Password reset code is verified" });
};

// resetPassword
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User;
  if (!user) throw new ApiError("No logged user found.", 404);

  if (!user.passResetCodeVerified)
    throw new ApiError(
      "Please verify your password with reset code first.",
      400
    );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await bcrypt.hash(req.body.newPassword, 10),
      passResetCode: undefined,
      passResetCodeEat: undefined,
      passResetCodeVerified: false,
    },
  });

  //generate the jwt
  const accessToken = generateAccessToken(user.id);

  // set cookie
  setAccessTokenCookie(res, accessToken);

  res.status(200).json({
    status: "success",
    message: "Password has been reseted successfully.",
    token: accessToken,
  });
};
