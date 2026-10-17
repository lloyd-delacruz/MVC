/** @type {import('next').NextConfig} */
const nextConfig = {
  // The pre-push hook sets PREPUSH_VERIFY=1 so its `next build` writes to a
  // separate output dir and never clobbers the `.next` a running `next dev`
  // is using. Dev and Vercel builds keep the default `.next`.
  distDir: process.env.PREPUSH_VERIFY ? ".next-verify" : ".next",
  // middleware.ts strips trailing slashes itself, in the same 301 as the
  // www → apex and legacy-URL redirects, so old URLs never chain two hops.
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
