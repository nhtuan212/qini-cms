/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 30, // cache dynamic route 30 seconds (default 0)
            static: 180, // cache static route 3 mins
        },
    },
};

module.exports = nextConfig;
