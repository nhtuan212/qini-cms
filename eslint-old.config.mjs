import globals from "globals";

import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupConfigRules } from "@eslint/compat";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const eslintConfig = [
    ...fixupConfigRules(
        compat.extends(
            "next/core-web-vitals",
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
        ),
    ),

    {
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
    },

    {
        rules: {
            "react/display-name": "off",

            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-unused-expressions": "off",
        },
    },

    {
        ignores: [
            "**/.next/**",
            "**/node_modules/**",
            "**/dist/**",
            "**/public/**",
            "**/**/*.scss",
        ],
    },
];

export default eslintConfig;
