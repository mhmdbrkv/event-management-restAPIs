import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { stripe } from "../Utils/stripe.js";
import ApiError from "./../Utils/apiError.js";
import sendEmail from "../Utils/sendEmail.js";
const Prisma = new PrismaClient();

export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { ticketId } = req.body;

    if (!user) {
      return next(new ApiError(`No user found`, 404));
    }

    const ticket = await Prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        Event: true,
        Users: true,
      },
    });

    if (!ticket) {
      return next(new ApiError(`No ticket found with id: ${ticketId}`, 404));
    }

    const amount = Math.round(ticket.price * 100); // Amount in cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: ticket.Event.title,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: process.env.STRIPE_SUCCESSFUL_URL,
      cancel_url: `${process.env.CLIENT_URL}/checkout-cancel?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: req.user?.email || "",
      metadata: {
        user_id: req.user?.id || "",
        ticket: ticket.id,
      },
    });

    if (!session.url) {
      return next(
        new ApiError(`Failed to create a Stripe checkout session`, 500)
      );
    }

    res.status(200).json({
      status: "success",

      url: session.url,
    });
  } catch (error) {
    return next(new ApiError(`Stripe session creation failed: ${error}`, 500));
  }
};

export const checkoutSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session_id = req.query.session_id as string;
  if (!session_id) {
    return next(new ApiError("No session found", 404));
  }
  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (!session) {
    return next(new ApiError("No session found", 404));
  }

  if (session.payment_status === "paid") {
    // create new order
    const userId = session.metadata?.user_id || "";

    const ticketId = session.metadata?.ticket;

    const ticketUser = await Prisma.ticket.update({
      where: { id: ticketId },
      data: {
        Users: {
          connect: { id: userId }, // Connect an existing ticket by ID
        },
      },
    });

    if (!ticketUser) {
      return next(new ApiError("Error with adding user ticket", 500));
    }

    const attendedUser = await Prisma.user.update({
      where: { id: userId },
      data: {
        AttendEvent: {
          connect: { id: ticketUser.eventId }, // Connect an existing ticket by ID
        },
      },
    });

    if (!attendedUser) {
      return next(new ApiError("Error with adding user ticket", 500));
    }

    const totalAmount = session.amount_total || 0;

    // Email Options

    const options = {
      email: session.customer_email || "",
      subject: `Purchase Success`,
      message: `Hi ${
        req.user?.username
      },\nWe sent this email to confirm you that your order has been succeed and you have paid ${
        totalAmount / 100
      } with card.\n\nThe Baraka E-Commerce-Store family`,
    };

    // Sending Email
    try {
      await sendEmail(options);
    } catch (err) {
      return next(new ApiError(`${err}`, 500));
    }

    res
      .status(201)
      .redirect(
        `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`
      );
  } else return next(new ApiError("Ticket payment Falid", 400));
};
