<template>
  <ClientOnly>
    <div ref="containerEl" class="markmap-container" :class="{ dark: isDark }">
      <svg ref="svgEl" />
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, useSlots } from 'vue'
import { isTag, isText, nodeChildren, nodeTextContent } from '@nuxtjs/mdc/runtime'

const svgEl = ref(null)
const containerEl = ref(null)
const slots = useSlots()
const isDark = ref(false)

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

      for (const child of children) {
        if (typeof child === 'string') {
          textParts.push(child)
        } else if (isText(child)) {
          textParts.push(child.value ?? child.children ?? '')
        } else if (isTag(child, 'ul') || isTag(child, 'ol')) {
          nestedLists.push(child)
        } else {
          textParts.push(nodeTextContent(child))
        }
      }

      const text = textParts.join('').trim()
      if (text) result += indent + '- ' + text + '\n'

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

onMounted(async () => {
  const vnodes = slots.default?.() ?? []
  const markdown = vnodeToMarkdown(vnodes)
  if (!markdown.trim()) return

  const { Transformer } = await import('markmap-lib')
  const { Markmap } = await import('markmap-view')

  const transformer = new Transformer()
  const { root } = transformer.transform(markdown)

  // 检测暗色模式
  const dark = typeof window !== 'undefined' &&
    (document.documentElement.classList.contains('dark') ||
     window.matchMedia('(prefers-color-scheme: dark)').matches)
  isDark.value = dark

  const mm = Markmap.create(svgEl.value, {
    autoFit: true,
    duration: 500,
  }, root)

  const container = containerEl.value
  if (container) {
    // 设置容器颜色
    container.style.backgroundColor = dark ? '#1a1a1a' : '#ffffff'
    container.style.borderColor = dark ? '#374151' : '#e5e7eb'

    const observer = new ResizeObserver(() => {
      mm.fit()
    })
    observer.observe(container)

    // 监听主题变化
    const themeObserver = new MutationObserver(() => {
      const newDark = document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      isDark.value = newDark
      container.style.backgroundColor = newDark ? '#1a1a1a' : '#ffffff'
      container.style.borderColor = newDark ? '#374151' : '#e5e7eb'
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  }
})
</script>

<style scoped>
.markmap-container {
  width: 100%;
  min-height: 400px;
  height: 80vh;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.markmap-container.dark {
  border-color: #374151;
  background: #1a1a1a;
}

.markmap-container :deep(svg) {
  width: 100%;
  height: 100%;
}

/* 强制文字颜色 */
.markmap-container :deep(.markmap-node text) {
  fill: #1f2937 !important;
}

.markmap-container.dark :deep(.markmap-node text) {
  fill: #e5e7eb !important;
}

@media (prefers-color-scheme: dark) {
  .markmap-container :deep(.markmap-node text) {
    fill: #e5e7eb !important;
  }
}
</style>
