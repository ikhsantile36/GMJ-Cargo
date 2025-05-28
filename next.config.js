/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // output: 'export', // Uncomment jika perlu static export
  // trailingSlash: true, // Optional untuk static export
}

export default nextConfig