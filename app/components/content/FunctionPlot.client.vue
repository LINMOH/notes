<template>
  <div
    ref="containerEl"
    class="function-plot-container"
    :class="{ dark: isDark }"
  >
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else ref="plotEl" class="plot-wrapper"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

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
const loading = ref(true)
const computedWidth = ref(800)
let functionPlotLoaded = false

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

const loadScript = () => {
  return new Promise((resolve, reject) => {
    if (window.functionPlot) {
      functionPlotLoaded = true
      resolve(window.functionPlot)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/function-plot@1.25.4/dist/function-plot.js'
    script.async = true
    script.onload = () => {
      functionPlotLoaded = true
      resolve(window.functionPlot)
    }
    script.onerror = () => reject(new Error('Failed to load function-plot'))
    document.head.appendChild(script)
  })
}

const initPlot = async () => {
  if (!plotEl.value || !containerEl.value) return
  
  loading.value = true
  
  try {
    const functionPlot = await loadScript()
    
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
    
    functionPlot(config)
    loading.value = false
  } catch (error) {
    console.error('Function plot error:', error)
    loading.value = false
  }
}

onMounted(async () => {
  const dark = typeof window !== 'undefined' &&
    (document.documentElement.classList.contains('dark') ||
     window.matchMedia('(prefers-color-scheme: dark)').matches)
  isDark.value = dark
  
  await nextTick()
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
  min-height: 400px;
  position: relative;
}

.function-plot-container.dark {
  background: #1f2937;
  border-color: #374151;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #6b7280;
}

.function-plot-container.dark .loading {
  color: #9ca3af;
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