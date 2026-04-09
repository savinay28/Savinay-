"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useState } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Use state so it's not initialized multiple times in development mode across HMR boundaries
  const [convex] = useState(() => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://example.convex.cloud"));
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
