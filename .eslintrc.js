module.exports = {
    env: { browser: true },
    extends: ["plugin:react/recommended", "google"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 12,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    settings: { react: { version: "detect" } },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        /** Disable rules */
        "no-unused-vars": "off",
        "no-invalid-this": "off",
        "require-jsdoc": "off",

        /** Basic */
        "max-len": ["error", 140],
        "indent": ["error", 4],
        "quotes": ["error", "double"],
        "@typescript-eslint/no-unused-vars": "warn",

        /** Naming Conversation */
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "memberLike",
                modifiers: ["private"],
                format: ["camelCase"],
                leadingUnderscore: "require",
            },
            {
                selector: "variable",
                types: ["boolean"],
                format: ["PascalCase"],
                prefix: ["is", "should", "has", "can", "did", "will", "ok"],
            },
        ],

        /** Object */
        "object-curly-newline": ["warn", { "multiline": true }],
        "object-curly-spacing": ["error", "always"],

        /** JSX */
        "react/jsx-first-prop-new-line": ["warn", "multiline"],
        "react/jsx-max-props-per-line": ["warn", { "maximum": 1, "when": "multiline" }],

        /** Array */
        "array-element-newline": ["warn", "consistent"],
        "array-bracket-newline": ["warn", { "multiline": true }],
    },
};
