import { z } from "zod";

export const registerSchema = z.object({
  role: z.enum(["admin", "organisation", "donor", "hospital"], {
    required_error: "Role is required",
  }),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  organisationName: z.string().min(2, "Organisation name must be at least 2 characters").optional(),
  hospitalName: z.string().min(2, "Hospital name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "organisation", "donor", "hospital"]),
});
