/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		domains: ["a.ppy.sh", `localhost`, "next.aimcup.xyz", "assets.ppy.sh"],
	},
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
	},
	experimental: {},
};

module.exports = nextConfig;
