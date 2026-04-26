import { z } from "zod";

export const createRequestSchema = z.object({
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Blood group is required",
  }),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .min(1, "Minimum 1 unit required"),
  organisation: z.string({ required_error: "Organisation is required" }),
  message: z.string().optional(),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(["approved", "rejected"], {
    required_error: "Status is required",
  }),
});
