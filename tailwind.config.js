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
			mintGreen: "#00CC99",
			tuned: "#5a4988",
		},
	},
	plugins: [require("daisyui")],
	daisyui: ["light"],
};
