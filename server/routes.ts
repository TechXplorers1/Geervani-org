import type { Express } from "express";
import { createServer, type Server } from "http";
import Razorpay from "razorpay";

export async function registerRoutes(app: Express): Promise<Server> {
  // Razorpay Order Creation (Required for Donations)
  app.post("/api/create-order", async (req, res) => {
    try {
      const { amount, currency = "INR" } = req.body;

      if (!amount || amount < 1) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Initialize Razorpay
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "",
      });

      const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise)
        currency,
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error: any) {
      console.error("Razorpay Error Details:", JSON.stringify(error, null, 2));
      console.error("Razorpay Error Message:", error.message);
      res.status(500).json({
        message: "Failed to create payment order",
        details: error.message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
