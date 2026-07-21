import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    bloodGroup: { // Stores which blood group is being requested.
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [true, "Blood group is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Minimum 1 unit"],
    },
    requestType: {
      type: String,
      enum: ["donor", "hospital"], // who is requesting
      required: true,
    },
    requestedBy: {// Stores who is making the request actual id
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    organisation: {//  Stores to whom the request was sent.
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
