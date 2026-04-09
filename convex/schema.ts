import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  history: defineTable({
    topic: v.string(),
    mode: v.union(v.literal("quiz"), v.literal("flashcard")),
    data: v.array(v.any()), // Supports Question or Flashcard type
    createdAt: v.number(),
  }),
});
