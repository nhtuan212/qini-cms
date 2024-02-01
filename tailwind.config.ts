import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import plugin from "tailwindcss/plugin";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: {
                    DEFAULT: "#ec4899",
                    400: "#f472b6",
                },
                error: {
                    DEFAULT: "#ef4444",
                },
                link: {
                    DEFAULT: "#3b82f6",
                },
            },
        },
    },
    variants: {
        tableLayout: ["responsive", "hover", "focus"],
    },
    darkMode: "class",
    plugins: [
        nextui(),

        plugin(function ({ addBase, theme, addVariant }) {
            addBase({
                h1: { fontSize: theme("fontSize.2xl") },
                h2: { fontSize: theme("fontSize.xl") },
                h3: { fontSize: theme("fontSize.lg") },
            });
            // Alias children element
            addVariant("img", "& > img");
            addVariant("input", "& > input");
        }),
    ],
};
export default config;
