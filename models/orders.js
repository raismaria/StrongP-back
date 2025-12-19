import { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      address: String,
      city: String,
      zipCode: String,
    },
    paymentMethod: {
      type: String,
      default: "onDelivery",
    },
    notes: String,
  },
  { timestamps: true }
);

const Order = model("orders", orderSchema);

export default Order;
