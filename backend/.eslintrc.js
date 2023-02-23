module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  overrides: [
    {
      files: ["src/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
      ],
      rules: {
        "no-await-in-loop": "warn",
        "no-constant-binary-expression": "warn",
        "no-constructor-return": "warn",
        "no-new-native-nonconstructor": "warn",
        "no-promise-executor-return": "warn",
        "no-self-compare": "warn",
        "no-template-curly-in-string": "warn",
        "no-unreachable-loop": "warn",
        "no-unused-private-class-members": "warn",
        "complexity": [
          "warn",
          10,
        ],
        "consistent-this": "warn",
        "curly": [
          "error",
          "all",
        ],
        // Use TypeScript's `noFallthroughCasesInSwitch` option
        "default-case": "off",
        "default-case-last": "error",
        "eqeqeq": [
          "error",
          "smart",
        ],
        "guard-for-in": "error",
        "max-classes-per-file": [
          "error",
          1,
        ],
        "max-depth": [
          "warn",
          4,
        ],
        "max-lines": [
          "warn",
          400,
        ],
        "max-lines-per-function": [
          "warn",
          75,
        ],
        "max-params": [
          "warn",
          5,
        ],
        "no-alert": "warn",
        "no-array-constructor": "error",
        "no-bitwise": "warn",
        "no-caller": "error",
        "no-console": "warn",
        "no-else-return": "warn",
        "no-eval": "error",
        "no-extra-label": "error",
        "no-implicit-coercion": "warn",
        "no-iterator": "error",
        "no-labels": "warn",
        "no-lone-blocks": "warn",
        "no-new": "warn",
        "no-new-wrappers": "error",
        "no-proto": "error",
        "no-restricted-syntax": "off",
        "no-return-assign": "error",
        "no-unneeded-ternary": "warn",
        "no-useless-computed-key": "error",
        "no-useless-concat": "warn",
        "no-useless-return": "error",
        "no-var": "error",
        "prefer-const": [
          "error",
          {
            "destructuring": "any",
            "ignoreReadBeforeAssign": false,
          },
        ],
        "prefer-exponentiation-operator": "warn",
        "prefer-numeric-literals": "error",
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-spread": "error",
        "yoda": "error",
        "@typescript-eslint/array-type": [
          "error",
          {
            "default": "array-simple",
            "readonly": "array-simple",
          },
        ],
        "@typescript-eslint/ban-types": [
          "off",
        ],
        "@typescript-eslint/consistent-generic-constructors": "error",
        "@typescript-eslint/consistent-indexed-object-style": "error",
        "@typescript-eslint/consistent-type-assertions": [
          "error",
          {
            "assertionStyle": "never",
          },
        ],
        "@typescript-eslint/consistent-type-definitions": "error",
        "@typescript-eslint/explicit-function-return-type": [
          "error",
          {
            "allowedNames": [],
          },
        ],
        "@typescript-eslint/member-ordering": [
          "error",
          {
            "default": {
              "memberTypes": [
                "static-field",
                "instance-field",
                "constructor",
                "static-method",
                "instance-method",
              ],
            },
          },
        ],
        "@typescript-eslint/no-confusing-non-null-assertion": "error",
        "@typescript-eslint/no-duplicate-enum-values": "warn",
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/no-inferrable-types": [
          "error",
          {
            "ignoreParameters": true,
            "ignoreProperties": true,
          },
        ],
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-unnecessary-condition": [
          "warn",
          {
            "allowConstantLoopConditions": true,
            "allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing": false,
          },
        ],
        "@typescript-eslint/prefer-enum-initializers": "warn",
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-nullish-coalescing": "warn",
        "@typescript-eslint/prefer-readonly": "warn",
        "@typescript-eslint/prefer-reduce-type-parameter": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "warn",
        "@typescript-eslint/require-array-sort-compare": "warn",
        "@typescript-eslint/switch-exhaustiveness-check": "warn",
        "@typescript-eslint/unbound-method": [
          "error",
          {
            "ignoreStatic": true,
          },
        ],
        "default-param-last": "off",
        "@typescript-eslint/default-param-last": "error",
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
        "@typescript-eslint/no-dupe-class-members": "off",
        // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
        "no-undef": "off",
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": [
          "error",
          {
            "allow": [
              "overrideMethods",
            ],
          },
        ],
        // Disabled due to the prettier conflict.
        "no-extra-semi": "off",
        // Disabled due to the prettier conflict.
        "@typescript-eslint/no-extra-semi": "off",
        "no-implied-eval": "off",
        "@typescript-eslint/no-implied-eval": "error",
        "no-loop-func": "off",
        "@typescript-eslint/no-loop-func": "warn",
        "no-loss-of-precision": "off",
        "@typescript-eslint/no-loss-of-precision": "error",
        "no-magic-numbers": "off",
        "@typescript-eslint/no-magic-numbers": [
          "warn",
          {
            "ignore": [],
            "ignoreArrayIndexes": true,
            "ignoreDefaultValues": true,
            "enforceConst": true,
            "detectObjects": false,
            "ignoreEnums": true,
            "ignoreNumericLiteralTypes": true,
            "ignoreReadonlyClassProperties": true,
            "ignoreTypeIndexes": true,
          },
        ],
        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            "argsIgnorePattern": "^_",
          },
        ],
        "no-useless-constructor": "off",
        "@typescript-eslint/no-useless-constructor": "error",
        "require-await": "off",
        "@typescript-eslint/require-await": "error",
      },
    },
  ],
  root: true,
};