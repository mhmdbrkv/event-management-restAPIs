import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

let STRIPE_SECRET = process.env.STRIPE_SECRET || "";

export default Stripe;
export const stripe = new Stripe(STRIPE_SECRET);
