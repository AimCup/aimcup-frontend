/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		domains: ["a.ppy.sh", `localhost`, "next.aimcup.xyz", "assets.ppy.sh"],
	},
	env: {
		API_URL: process.env.API_URL,
		URL: process.env.URL,
	},
	experimental: {},
};

module.exports = nextConfig;
