import { defineNuxtConfig } from 'nuxt/config'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export default defineNuxtConfig({
  extends: ['docus'],

  css: ['katex/dist/katex.min.css'],

  content: {
    markdown: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex]
    },
    build: {
      markdown: {
        highlight: {
          langs: ['cpp', 'c', 'python', 'rust']
        }
      }
    }
  }
})