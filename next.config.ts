import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true, // For easier Vercel/Static Export compatibility
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
