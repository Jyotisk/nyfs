import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Force HTTPS for 1 year
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Disable browser features not in use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Limit referrer info sent cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Basic XSS protection for legacy browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
