<template>
  <ClientOnly>
    <div
      ref="containerEl"
      class="markmap-container"
      :class="{ dark: isDark, 'is-fullscreen': isFullscreen }"
    >
      <div class="markmap-toolbar">
        <button @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏查看'">
          <Icon :name="isFullscreen ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'" />
        </button>
        <button @click="fitToScreen" title="适应屏幕">
          <Icon name="i-lucide-maximize" />
        </button>
        <button @click="downloadSVG" title="导出 SVG">
          <Icon name="i-lucide-download" />
        </button>
      </div>
      <svg ref="svgEl" />
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, useSlots, onUnmounted } from 'vue'
import { isTag, isText, nodeChildren, nodeTextContent } from '@nuxtjs/mdc/runtime'

const svgEl = ref(null)
const containerEl = ref(null)
const slots = useSlots()
const isDark = ref(false)
const isFullscreen = ref(false)
let mmInstance = null

function vnodeToMarkdown(vnodes, depth = 0) {
  if (!vnodes) return ''
  const indent = '  '.repeat(depth)
  let result = ''

  const nodes = Array.isArray(vnodes) ? vnodes : [vnodes]

  for (const vnode of nodes) {
    if (!vnode) continue

    if (typeof vnode === 'string') {
      const text = vnode.trim()
      if (text) result += indent + '- ' + text + '\n'
    } else if (isText(vnode)) {
      const text = (vnode.value ?? vnode.children ?? '').trim()
      if (text) result += indent + '- ' + text + '\n'
    } else if (isTag(vnode, 'ul') || isTag(vnode, 'ol')) {
      const children = nodeChildren(vnode)
      result += vnodeToMarkdown(children, depth)
    } else if (isTag(vnode, 'li')) {
      const children = nodeChildren(vnode)
      const textParts = []
      const nestedLists = []

      // 递归处理内容以寻找文本、图片和数学公式
      function processContent(nodes) {
        for (const node of nodes) {
          if (typeof node === 'string') {
            textParts.push(node)
          } else if (isText(node)) {
            textParts.push(node.value ?? node.children ?? '')
          } else if (isTag(node, 'img')) {
            const props = node.props || {}
            textParts.push(`<img src="${props.src || ''}" alt="${props.alt || ''}" style="max-width: 100px; display: block; margin: 4px 0;" />`)
          } else if (isTag(node, 'ul') || isTag(node, 'ol')) {
            nestedLists.push(node)
          } else if (node.props?.className?.some?.(c => c.includes('math')) || node.props?.className?.includes?.('math')) {
            // 发现数学公式节点
            const className = Array.isArray(node.props.className) ? node.props.className.join(' ') : (node.props.className || '')
            const isInline = className.includes('math-inline')
            
            // 尝试获取原始内容
            let content = nodeTextContent(node)
            
            // 如果 content 已经是渲染后的 HTML（包含 katex 类名），我们可能需要寻找 annotation 标签中的原始 LaTeX
            // 但在 Nuxt Content 中，通常 nodeTextContent 就能拿到公式文本
            
            if (content) {
              // 确保公式前后有空格，防止 Markmap 解析失败
              if (isInline) {
                textParts.push(` <span class="katex">\\(${content.trim()}\\)</span> `)
              } else {
                textParts.push(`\n\n<div class="katex">\\[${content.trim()}\\]</div>\n\n`)
              }
            }
          } else if (isTag(node, 'p') || isTag(node, 'span')) {
            // 递归处理段落和行内容器
            processContent(nodeChildren(node))
          } else {
            const children = nodeChildren(node)
            if (children.length > 0) {
              processContent(children)
            } else {
              textParts.push(nodeTextContent(node))
            }
          }
        }
      }

      processContent(children)

      const text = textParts.join('').trim()
      if (text) {
        // 保持缩进并添加列表项符号
        // 注意：不要用 replace(/\n/g, ' ') 破坏块级公式的换行需求
        result += indent + '- ' + text + '\n'
      }

      for (const list of nestedLists) {
        result += vnodeToMarkdown(nodeChildren(list), depth + 1)
      }
    } else {
      const children = nodeChildren(vnode)
      if (children.length > 0) {
        result += vnodeToMarkdown(children, depth)
      } else {
        const text = nodeTextContent(vnode).trim()
        if (text) result += indent + '- ' + text + '\n'
      }
    }
  }

  return result
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEsc)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleEsc)
  }
  // 增加延时并调用重绘
  setTimeout(() => {
    mmInstance?.fit()
  }, 500)
}

const handleEsc = (e) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}

const fitToScreen = () => {
  mmInstance?.fit()
}

const downloadSVG = () => {
  if (!svgEl.value) return
  const svgData = new XMLSerializer().serializeToString(svgEl.value)
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `markmap-${Date.now()}.svg`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(async () => {
  const vnodes = slots.default?.() ?? []
  const markdown = vnodeToMarkdown(vnodes)
  if (!markdown.trim()) return

  const { Transformer } = await import('markmap-lib')
  const { Markmap, loadCSS, loadJS } = await import('markmap-view')

  const transformer = new Transformer()
  
  const { root, features } = transformer.transform(markdown)
  
  // 必须使用 transformer.getAssets() 获取最新的资产（包含 Katex）
  const assets = transformer.getAssets()
  if (assets.styles) loadCSS(assets.styles)
  if (assets.scripts) loadJS(assets.scripts)

  // 检测暗色模式
  const dark = typeof window !== 'undefined' &&
    (document.documentElement.classList.contains('dark') ||
     window.matchMedia('(prefers-color-scheme: dark)').matches)
  isDark.value = dark

  mmInstance = Markmap.create(svgEl.value, {
    autoFit: true,
    duration: 500,
    paddingX: 16,
    initialExpandLevel: 999, // 默认展开全部节点
  }, root)

  const container = containerEl.value
  if (container) {
    // 设置容器颜色
    container.style.backgroundColor = dark ? '#1a1a1a' : '#ffffff'
    container.style.borderColor = dark ? '#374151' : '#e5e7eb'

    const observer = new ResizeObserver(() => {
      mmInstance?.fit()
    })
    observer.observe(container)

    // 监听主题变化
    const themeObserver = new MutationObserver(() => {
      const newDark = document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      if (isDark.value !== newDark) {
        isDark.value = newDark
        container.style.backgroundColor = newDark ? '#1a1a1a' : '#ffffff'
        container.style.borderColor = newDark ? '#374151' : '#e5e7eb'
        
        // 重新渲染以应用主题相关的文字颜色（如果 markmap 内部有逻辑）
        // 或者手动触发 fit 确保位置正确
        mmInstance?.fit()
      }
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.markmap-container {
  position: relative;
  width: 100%;
  min-height: 400px;
  height: 60vh;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: all 0.3s ease;
  margin: 1.5rem 0;
}

.markmap-container.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  margin: 0;
  border-radius: 0;
}

.markmap-container.dark {
  border-color: #374151;
  background: #1a1a1a;
}

.markmap-toolbar {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
  opacity: 0.3;
  transition: opacity 0.3s;
}

.markmap-container:hover .markmap-toolbar {
  opacity: 1;
}

.markmap-toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background: rgba(229, 231, 235, 0.8);
  color: #374151;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .markmap-toolbar button {
  background: rgba(55, 65, 81, 0.8);
  color: #e5e7eb;
}

.markmap-toolbar button:hover {
  background: rgba(209, 213, 219, 1);
  transform: scale(1.05);
}

.dark .markmap-toolbar button:hover {
  background: rgba(75, 85, 99, 1);
}

.markmap-container :deep(svg) {
  width: 100%;
  height: 100%;
}

/* 强制文字颜色 */
.markmap-container :deep(.markmap-node text) {
  fill: #1f2937 !important;
}

.markmap-container :deep(.markmap-node div) {
  color: #1f2937 !important;
}

.markmap-container.dark :deep(.markmap-node text) {
  fill: #f3f4f6 !important;
}

.markmap-container.dark :deep(.markmap-node div),
.markmap-container.dark :deep(.markmap-node foreignObject),
.markmap-container.dark :deep(.markmap-node span),
.markmap-container.dark :deep(.markmap-node code) {
  color: #f3f4f6 !important;
}

/* KaTeX 颜色适配 */
.markmap-container.dark :deep(.katex) {
  color: #f3f4f6 !important;
}

/* 连接线颜色适配 */
.markmap-container.dark :deep(.markmap-link) {
  stroke: #4b5563 !important;
}

/* 节点圆点颜色适配 */
.markmap-container.dark :deep(.markmap-node circle) {
  stroke: #6b7280 !important;
}
</style>
