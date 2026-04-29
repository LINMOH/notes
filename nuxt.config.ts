import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  extends: ["docus"],
  css: ["katex/dist/katex.min.css"],
  content: {
    build: {
      markdown: {
        remarkPlugins: { "remark-math": {} },
        rehypePlugins: { "rehype-katex": {} },
        highlight: {
          langs: ["cpp", "c", "python", "rust", "go"],
        },
      },
    },
  },
  vite: {
    optimizeDeps: {
      include: ['markmap-lib', 'markmap-view']
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/]
      }
    }
  }
});