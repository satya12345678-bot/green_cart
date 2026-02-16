import Product from "../models/Product.js";
import Order from "../models/Order.js";
import stripe from "stripe"
import User from "../models/User.js";
import { request,response } from "express";

// place order COD : api/order/place


export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || items.length === 0 || !address) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const userId = req.userId;

    // 🔥 Calculate total amount from DB (NEVER trust frontend)
    let amount = 0;

    for (let item of items) {
      const productData = await Product.findById(item.product);

      if (!productData) {
        return res.json({
          success: false,
          message: "Product not found",
        });
      }

      amount += productData.offerPrice * item.quantity;
    }

    // Add 2% tax like frontend
    amount = amount + amount * 0.02;

    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",  // REQUIRED
      isPaid: false,
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


//PLACE order stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const { origin } = req.headers;
    const userId = req.userId;

    if (!items || items.length === 0 || !address) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    let product = [];
    let amount = 0;

    for (let item of items) {
      const productData = await Product.findById(item.product);

      if (!productData) {
        return res.json({
          success: false,
          message: "Product not found",
        });
      }

      product.push({
        name: productData.name,
        price: productData.offerPrice,
        quantity: item.quantity,
      });

      amount += productData.offerPrice * item.quantity;
    }

    amount = amount * 1.02;

    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false,
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = product.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 1.02 * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: newOrder._id.toString(),
        userId,
      },
    });

    res.json({
      success: true,
      url: session.url,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
//stripe webhooks to verify payments:/stripe
export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body, // MUST be raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("Webhook signature failed:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {

      // ✅ PAYMENT SUCCESS
      case "checkout.session.completed": {
        const session = event.data.object;

        const { orderId, userId } = session.metadata;

        // Mark order as paid
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
        });

        // Clear user cart
        await User.findByIdAndUpdate(userId, {
          cartItems: {},
        });

        console.log("Payment successful, order updated");
        break;
      }

      // PAYMENT FAILED
      case "payment_intent.payment_failed": {
        console.log("Payment failed");
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.status(200).json({ received: true });

  } catch (error) {
    console.log("Webhook processing error:", error.message);
    response.status(500).json({ success: false });
  }
};



// get orders by user id : api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;   // ✅ FIXED

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });

  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};


// get all orders (for seller/admin) : api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
