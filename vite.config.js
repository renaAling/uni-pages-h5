import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // 本地代理配置
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ""),
        },
      },
    },
    // sass 配置 + sass 高等级 warning 关闭
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/vars.scss"; @import "@/styles/mixins.scss";`,
          silenceDeprecations: ["legacy-js-api", "color-functions", "import"],
        },
      },
    },
    plugins: [
      AutoImport({
        imports: ["vue", "uni-app"],
        eslintrc: {
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
      }),
      uni(),
    ],
    define: {
      "process.env": {
        VITE_ENV_MODE: JSON.stringify(mode),
      },
    },
  };
});
