<script setup lang="ts">
import { ref, computed } from 'vue'

// ==========================================
// 1. 类型定义 (Type Definitions)
// ==========================================
interface Pharmacy {
  id: number
  name: string
  dist: string
  addr: string
  hours: string
  phone: string
  rating: number
}

// ==========================================
// 2. 状态管理 (State)
// ==========================================
const keyword = ref<string>('')

// 模拟数据
const pharmacies = ref<Pharmacy[]>([
  { id: 1, name: '老百姓大药房', dist: '500m', addr: '幸福路128号', hours: '08:00-22:00', phone: '021-12345678', rating: 4.8 },
  { id: 2, name: '益丰大药房', dist: '800m', addr: '安康路256号', hours: '07:30-23:00', phone: '021-87654321', rating: 4.6 },
  { id: 3, name: '国大药房', dist: '1.2km', addr: '长寿路399号', hours: '09:00-21:00', phone: '021-56781234', rating: 4.5 },
  { id: 4, name: '海王星辰', dist: '1.5km', addr: '健康大道500号', hours: '08:30-22:30', phone: '021-43218765', rating: 4.3 },
])

// ==========================================
// 3. 核心逻辑 (Computed & Methods)
// ==========================================
// 采用 computed 替代手动 watch/event，利用 Vue 响应式依赖自动追踪
const filteredPharmacies = computed<Pharmacy[]>(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return pharmacies.value
  
  return pharmacies.value.filter(
    p => p.name.toLowerCase().includes(kw) || p.addr.toLowerCase().includes(kw)
  )
})

const dial = (phone: string): void => {
  // 生产环境建议加上拨号前的二次确认弹窗，或使用系统原生能力
  window.location.href = `tel:${phone}`
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 font-sans pb-12">
    
    <!-- 头部导航（带磨砂玻璃效果，滑动时视觉更佳） -->
    <header class="px-5 pt-8 pb-4 sticky top-0 bg-stone-50/90 backdrop-blur-md z-10">
      <h2 class="text-xl font-bold text-stone-800 tracking-wide">附近药店</h2>
    </header>

    <main class="px-5 space-y-6">
      
      <!-- 搜索与地图模块 -->
      <section aria-label="搜索与地图" class="space-y-4">
        <!-- 搜索框 -->
        <div class="relative">
          <input
            v-model="keyword"
            type="search"
            class="w-full bg-white border border-stone-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 rounded-2xl px-4 py-3 pl-11 text-sm transition-all outline-none text-stone-800 placeholder-stone-400 shadow-sm"
            placeholder="搜索药店名称或地址..."
          />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-base">🔍</span>
        </div>

        <!-- 地图占位 (使用了软化的背景和径向渐变，提升治愈感) -->
        <div class="bg-stone-200/50 border border-stone-200/50 rounded-3xl h-40 flex flex-col items-center justify-center text-stone-500 text-sm shadow-inner overflow-hidden relative">
           <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-400 to-transparent"></div>
           <span class="text-2xl mb-1 z-10 drop-shadow-sm">📍</span>
           <span class="z-10 font-medium">附近药店地图（接入 API 后展示）</span>
        </div>
      </section>

      <!-- 药店列表模块 -->
      <section aria-label="药店列表" class="space-y-3">
        
        <!-- 空状态展示 -->
        <div v-if="filteredPharmacies.length === 0" class="text-center py-10 animate-fade-in">
          <div class="text-4xl mb-3 opacity-60">🍃</div>
          <p class="text-stone-400 text-sm font-medium">没有找到相关的药店呢</p>
        </div>

        <!-- 药店卡片 -->
        <article
          v-for="p in filteredPharmacies"
          :key="p.id"
          class="bg-white rounded-3xl p-4 shadow-sm border border-stone-100 flex items-center gap-4 transition-all duration-300 ease-out active:scale-[0.98] hover:shadow-md"
        >
          <!-- 左侧图标 -->
          <div class="w-12 h-12 bg-orange-50 text-orange-400 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            🏪
          </div>
          
          <!-- 中间主体信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-1.5">
              <div class="flex items-center gap-2 overflow-hidden">
                <h3 class="font-bold text-stone-800 text-base truncate">{{ p.name }}</h3>
                <span class="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                  {{ p.dist }}
                </span>
              </div>
              <span class="text-[11px] text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">
                ★ {{ p.rating }}
              </span>
            </div>
            <div class="text-xs text-stone-500 truncate mb-1">{{ p.addr }}</div>
            <div class="text-[11px] text-stone-400 flex items-center gap-1 font-medium">
              <span>⏱</span> 营业时间：{{ p.hours }}
            </div>
          </div>
          
          <!-- 右侧拨号按钮 (标准的 48px 触控区) -->
          <button
            class="w-12 h-12 bg-orange-50 hover:bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-xl flex-shrink-0 transition-all duration-300 active:scale-90 shadow-sm"
            aria-label="拨打药店电话"
            @click="dial(p.phone)"
          >
            📞
          </button>
        </article>

      </section>
    </main>
  </div>
</template>

<style scoped>
/* 预留淡入动画供空状态使用 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>