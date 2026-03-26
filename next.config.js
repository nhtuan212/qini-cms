/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        staleTimes: {
            dynamic: 30, // cache dynamic route 30 giây (mặc định 0)
            static: 180, // cache static route 3 phút
        },
    },
};

module.exports = nextConfig;
