import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveHistory = mutation({
  args: {
    topic: v.string(),
    mode: v.union(v.literal("quiz"), v.literal("flashcard")),
    data: v.array(v.any()), // We use any to store dynamic arrays of questions or flashcards
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("history", {
      topic: args.topic,
      mode: args.mode,
      data: args.data,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    // Return all history items, sorted newest to oldest
    return await ctx.db.query("history").order("desc").collect();
  },
});

export const getSingleSet = query({
  args: { id: v.id("history") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
