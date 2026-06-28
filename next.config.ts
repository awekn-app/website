import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Pin the workspace root to THIS folder. A stray package-lock.json in the
  // home dir made Turbopack infer /Users/areeb as the root, which crashed HMR
  // in a reload loop ("Resource path needs to be on project filesystem").
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
