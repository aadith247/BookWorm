import { z } from 'zod';

// Schema for validating just an email address
export const emailSchema = z.object({
  email: z.string({
    required_error: "Email is required", // Optional: Custom message
  })
  .email({ message: "Invalid email address" }), // Use Zod's built-in email validation
});

// You can add other schemas here later, e.g., for password, username, etc.
// export const passwordSchema = z.object({ ... }); 