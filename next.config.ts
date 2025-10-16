import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;
      style-src 'self' 'unsafe-inline' https:;
      img-src 'self' data: https:;
      connect-src 'self' https://dabeez-backend.fly.dev https://api.vercel.com https://*.firebaseio.com https://*.googleapis.com https://*.firestore.googleapis.com;
      font-src 'self' https:;
      frame-src 'self';
    `.replace(/\s{2,}/g, " ").trim(),
  },
];

const nextConfig: NextConfig = { //
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;