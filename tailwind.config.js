/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
	content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					light: "#FFFFFF",
					DEFAULT: "#f5f5f5",
					dark: "#151120",
				},
			},
		},
		colors: {
			deepCharcoal: "#151120",
			deepRed: "#CA191B",
			flatRed: "rgb(239 55 57)",
			mintGreen: "#00CC99",
			tuned: "#241e38",
		},
	},
	plugins: [require("daisyui")],
	daisyui: ["light"],
};
