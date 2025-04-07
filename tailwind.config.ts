import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";
import plugin from "tailwindcss/plugin";
import colors from "tailwindcss/colors";

const config: Config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
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
                    DEFAULT: colors.pink[500],
                    ...colors.pink,
                },
                link: {
                    DEFAULT: colors.blue[500],
                    ...colors.blue,
                },
                error: {
                    DEFAULT: colors.red[500],
                    ...colors.red,
                },
            },

            screens: {
                xs: "460px",
            },

            // Animation
            animation: {
                zoomIn: "zoomIn .2s ease-in-out",
                fadeIn: "fadeIn .2s ease-in-out",
                fadeInLeft: "fadeInLeft .2s ease-in-out",
            },

            // that is actual animation
            keyframes: () => ({
                zoomIn: {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(100px) scale(0.6) translateZ(100px)",
                    },
                    "100%": { opacity: "1", transform: "translateY(0px) scale(1) translateZ(0px)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                fadeInLeft: {
                    "0%": { opacity: "0", transform: "translateX(-20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
            }),
        },
    },
    variants: {
        tableLayout: ["responsive", "hover", "focus"],
    },
    darkMode: "class",
    plugins: [
        heroui(),

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
