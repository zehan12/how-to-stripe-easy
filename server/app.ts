import env from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cors from "cors";
import Stripe from "stripe";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
  });
  

app.post("/create-payment-intent", async (_:Request, res:Response) => {
  console.log("req");
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1,
      currency: "usd",
      // desc & shipping is require if you are using this service in india
      description: "Software development services",
      shipping: {
        name: "Zehan Khan",
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US",
        },
      },
      receipt_email: "zehan9211@gmail.com",
      payment_method_types: ["card"],
      metadata: { integration_check: "accept_a_payment" },
    });
    res.status(200).json({
      message: "Send client secret",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(3000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${3000}`);
});