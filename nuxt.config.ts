import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  extends: ["docus"],
  css: ["katex/dist/katex.min.css"],

  // Docus defaults to Iconify CDN; use local @iconify-json/* instead (avoids load timeouts).
  icon: {
    provider: "server",
    serverBundle: "local",
    clientBundle: {
      scan: {
        globInclude: [
          "**/*.{vue,jsx,tsx,md,mdc,mdx}",
          "content/**/*.yml",
        ],
      },
      includeCustomCollections: true,
    },
  },

  llms: {
    domain: process.env.NUXT_SITE_URL || "https://linmoh.github.io/notes",
  },

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