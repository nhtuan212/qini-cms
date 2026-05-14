import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores([
        "**/.next/**",
        "**/node_modules/**",
        "**/dist/**",
        "**/public/**",
        "**/**/*.scss",
    ]),
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        settings: {
            react: {
                version: "19.2.4",
            },
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "no-useless-assignment": "off",

            "react/react-in-jsx-scope": "off",
            "react/display-name": "off",

            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-unused-expressions": "off",
            "react/prop-types": "off",
        },
    },
]);
