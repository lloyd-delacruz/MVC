/** @type {import('next').NextConfig} */
const nextConfig = {
  // The pre-push hook sets PREPUSH_VERIFY=1 so its `next build` writes to a
  // separate output dir and never clobbers the `.next` a running `next dev`
  // is using. Dev and Vercel builds keep the default `.next`.
  distDir: process.env.PREPUSH_VERIFY ? ".next-verify" : ".next",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
