const { z } = require("zod");
const CATEGORIES = ["Conference", "Workshop", "Meetup", "Social", "Other"];

const dateTimeField = z
  .string()
  .min(1, "Required")
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Enter a valid date and time",
  );

const eventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title can be at most 100 characters"),
    description: z
      .string()
      .trim()
      .max(1000, "Description can be at most 1000 characters")
      .default(""),
    location: z
      .string()
      .trim()
      .min(1, "Location is required")
      .max(100, "Location can be at most 100 characters"),
    startDate: dateTimeField,
    endDate: dateTimeField,
    capacity: z.coerce
      .number()
      .int("Capacity must be a whole number")
      .positive("Capacity must be greater than 0")
      .max(100000, "Capacity is too large"),
    category: z.enum(CATEGORIES, {
      message: "Choose a category from the list",
    }),
  })
  .refine(
    (event) => {
      const start = Date.parse(event.startDate);
      const end = Date.parse(event.endDate);
      if (Number.isNaN(start) || Number.isNaN(end)) return true; // field errors already reported
      return end > start;
    },
    { message: "End must be after the start", path: ["endDate"] },
  );

module.exports = { eventSchema, CATEGORIES };
