/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		domains: ["a.ppy.sh"],
	},
	env: {
		API_URL: process.env.API_URL,
		URL: process.env.URL,
	},
};

module.exports = nextConfig;
