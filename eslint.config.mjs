import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import { readFile } from "node:fs/promises";
const autoImportFile = new URL("./.eslintrc-auto-import.json", import.meta.url);
const autoImportJson = JSON.parse(await readFile(autoImportFile, "utf8"));
// import autoImportJson from "./.eslintrc-auto-import.json" with { type: "json" };

export default [
  {
    ignores: [
      "src/uni_modules/**", // 确保使用 ** 递归忽略
    ],
  },
  { files: ["**/*.{js,mjs,cjs,vue}"] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImportJson.globals,
        uni: true,
        wx: true,
      },
    },
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    rules: {
      "vue/multi-word-component-names": 0, // 要求组件名称始终为多字
      "vue/no-reserved-component-names": 0, // 不允许在组件定义中使用保留名称
    },
  },
  eslintPluginPrettierRecommended,
];
