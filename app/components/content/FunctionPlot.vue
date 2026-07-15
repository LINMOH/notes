<template>
  <ClientOnly>
    <div
      ref="containerEl"
      class="function-plot-container"
      :class="{ dark: isDark }"
    >
      <div ref="plotEl" class="plot-wrapper"></div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

const props = defineProps({
  functions: {
    type: Array,
    default: () => []
  },
  xDomain: {
    type: Array,
    default: () => [-10, 10]
  },
  yDomain: {
    type: Array,
    default: null
  },
  height: {
    type: Number,
    default: 400
  },
  grid: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  }
})

const containerEl = ref(null)
const plotEl = ref(null)
const isDark = ref(false)
const computedWidth = ref(800)

const getDefaultColor = (index) => {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
  return colors[index % colors.length]
}

const parseExpression = (expr) => {
  return expr
    .replace(/\^/g, '**')
    .replace(/exp\(/g, 'Math.exp(')
    .replace(/log\(/g, 'Math.log(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/pi/gi, 'Math.PI')
    .replace(/e\b/gi, 'Math.E')
}

const initPlot = async () => {
  if (!plotEl.value || !containerEl.value) return
  
  const functionPlot = await import('function-plot')
  
  const el = plotEl.value
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
  
  computedWidth.value = containerEl.value.clientWidth || 800
  
  const config = {
    target: el,
    width: computedWidth.value,
    height: props.height,
    xAxis: { domain: props.xDomain },
    yAxis: props.yDomain ? { domain: props.yDomain } : {},
    grid: props.grid,
    title: props.title,
    data: props.functions.map(fn => ({
      fn: parseExpression(fn.expression),
      color: fn.color || getDefaultColor(props.functions.indexOf(fn)),
      label: fn.label || '',
      graphType: fn.graphType || 'line',
      ...(fn.domain && { domain: fn.domain }),
      ...(fn.fnType && { fnType: fn.fnType }),
      ...(fn.r && { r: parseExpression(fn.r) })
    }))
  }
  
  if (isDark.value) {
    config.xAxis.color = '#9ca3af'
    config.yAxis.color = '#9ca3af'
    config.grid.color = '#374151'
  }
  
  functionPlot.default(config)
}

onMounted(() => {
  const dark = typeof window !== 'undefined' &&
    (document.documentElement.classList.contains('dark') ||
     window.matchMedia('(prefers-color-scheme: dark)').matches)
  isDark.value = dark
  
  initPlot()
  
  const resizeObserver = new ResizeObserver(() => {
    if (containerEl.value && containerEl.value.clientWidth !== computedWidth.value) {
      initPlot()
    }
  })
  resizeObserver.observe(containerEl.value)
  
  const themeObserver = new MutationObserver(() => {
    const newDark = document.documentElement.classList.contains('dark') ||
      (!document.documentElement.classList.contains('light') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (isDark.value !== newDark) {
      isDark.value = newDark
      initPlot()
    }
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  
  onUnmounted(() => {
    resizeObserver.disconnect()
    themeObserver.disconnect()
  })
})

watch(() => [props.functions, props.xDomain, props.yDomain], () => {
  initPlot()
}, { deep: true })
</script>

<style scoped>
.function-plot-container {
  width: 100%;
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.function-plot-container.dark {
  background: #1f2937;
  border-color: #374151;
}

.plot-wrapper {
  width: 100%;
}

.plot-wrapper :deep(.function-plot) {
  width: 100%;
  height: auto;
}

.plot-wrapper :deep(.x-axis text),
.plot-wrapper :deep(.y-axis text) {
  fill: #374151;
}

.function-plot-container.dark :deep(.x-axis text),
.function-plot-container.dark :deep(.y-axis text) {
  fill: #d1d5db;
}

.plot-wrapper :deep(.title) {
  font-size: 16px;
  font-weight: 600;
  fill: #1f2937;
}

.function-plot-container.dark :deep(.title) {
  fill: #f9fafb;
}

.plot-wrapper :deep(.gridline) {
  stroke: #e5e7eb;
}

.function-plot-container.dark :deep(.gridline) {
  stroke: #374151;
}
</style>