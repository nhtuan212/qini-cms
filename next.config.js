/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "tailwindui.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            { protocol: "https", hostname: "i.pravatar.cc" },
        ],
    },
};

module.exports = nextConfig;
