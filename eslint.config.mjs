import globals from "globals";
import eslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintParser from '@typescript-eslint/parser';
import eslintJs from '@eslint/js';

const { configs: { recommended: eslintRecommended } } = eslintJs;

export default [
  eslintRecommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': eslintPlugin,
    },
    languageOptions: {
      parser: eslintParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node, // Añade las variables globales de Node.js
      },
    },
    rules: {
      'no-unused-vars': 'off',
     
      'no-redeclare': 'off',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'always'],

    },
  },
];