<script setup lang="ts">
/**
 * 页面名称：首页 (Dashboard)
 * 相对地址：src/views/Home.vue
 * 功能概括：展示系统全局状态看板，包括欢迎语、临期药品紧急提醒、今日服药任务进度及核心功能快捷入口。
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ==========================================
// 1. 类型定义 (Type Definitions)
// ==========================================
interface FeatureItem {
  title: string
  desc: string
  icon: string
  path: string
}

interface MedicationTask {
  id: string
  name: string
  dosage: string
  time: string
  isTaken: boolean
}

interface ExpiringWarning {
  id: string
  name: string
  expiryDate: string
  daysLeft: number
}

// ==========================================
// 2. 状态与模拟数据 (State & Mock Data)
// ==========================================
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return '早上好 ☀️'
  if (h < 18) return '下午好 🌤️'
  return '晚上好 🌙'
})

// 功能区导航
const features: FeatureItem[] = [
  { title: '录入药品', desc: '管理药品信息与有效期', icon: '💊', path: '/medicine' },
  { title: '服药提醒', desc: '定时推送不错过每次用药', icon: '⏰', path: '/reminder' },
  { title: '有效期预警', desc: '临期药品高亮及时更换', icon: '⚠️', path: '/medicine' },
  { title: '附近药店', desc: '快速查找周边一键拨号', icon: '📍', path: '/pharmacy' },
]

// 模拟数据：今日待服药
const todayTasks = ref<MedicationTask[]>([
  { id: '1', name: '阿莫西林胶囊', dosage: '2粒 (0.5g)', time: '08:00', isTaken: true },
  { id: '2', name: '布洛芬缓释胶囊', dosage: '1粒 (0.3g)', time: '20:00', isTaken: false },
])

// 模拟数据：临期药品
const expiringMeds = ref<ExpiringWarning[]>([
  { id: '101', name: '小儿氨酚黄那敏颗粒', expiryDate: '2023-12-31', daysLeft: 15 },
])

const pendingTasksCount = computed(() => todayTasks.value.filter(t => !t.isTaken).length)

// ==========================================
// 3. 交互逻辑 (Actions)
// ==========================================
const toggleTaskStatus = (task: MedicationTask) => {
  task.isTaken = !task.isTaken
}
</script>

<template>
  <!-- 全局背景使用柔和的石色，避免纯白的刺眼感，更具治愈系 -->
  <div class="min-h-screen bg-stone-50 font-sans pb-10">
    
    <!-- 头部：沉浸式渐变背景与问候语 -->
    <header class="bg-gradient-to-br from-orange-400 to-orange-500 pt-12 pb-16 px-6 text-white rounded-b-[2.5rem] shadow-lg shadow-orange-500/20">
      <h2 class="text-2xl font-bold mb-2 tracking-wide">{{ greeting }}</h2>
      <p class="text-sm opacity-90 font-medium">
        守护家人健康，从药品管理开始
      </p>
    </header>

    <!-- 主体内容：使用负 margin 实现层叠穿透效果，增加视觉层次 -->
    <main class="px-5 -mt-8 space-y-6">

      <!-- 模块 1：状态看板（临期预警 & 今日服药） -->
      <section aria-label="健康动态" class="space-y-4">
        
        <!-- 临期预警卡片（仅在有数据时显示） -->
        <div 
          v-if="expiringMeds.length > 0" 
          class="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between shadow-sm"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-lg">
              ⚠️
            </div>
            <div>
              <div class="text-sm font-bold text-stone-800">发现 {{ expiringMeds.length }} 款临期药品</div>
              <div class="text-xs text-stone-500 mt-0.5">请及时处理，避免误服</div>
            </div>
          </div>
          <button class="px-3 py-1.5 bg-white text-orange-500 text-xs font-bold rounded-full shadow-sm active:scale-95 transition-transform">
            去查看
          </button>
        </div>

        <!-- 今日服药任务卡片 -->
        <div class="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
          <div class="flex justify-between items-end mb-4">
            <div>
              <h3 class="text-lg font-bold text-stone-800">今日用药</h3>
              <p class="text-xs text-stone-400 mt-1">
                {{ pendingTasksCount > 0 ? `还有 ${pendingTasksCount} 次待服用` : '今日用药已全部完成，真棒！' }}
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <div 
              v-for="task in todayTasks" 
              :key="task.id"
              class="group flex items-center justify-between p-3 rounded-2xl transition-colors duration-300 cursor-pointer min-h-[44px]"
              :class="task.isTaken ? 'bg-stone-50' : 'bg-orange-50/50 hover:bg-orange-50'"
              @click="toggleTaskStatus(task)"
            >
              <div class="flex items-center gap-4">
                <!-- 自定义 Checkbox UI -->
                <div 
                  class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                  :class="task.isTaken ? 'border-orange-400 bg-orange-400' : 'border-stone-300 bg-white'"
                >
                  <svg v-if="task.isTaken" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-bold transition-colors" :class="task.isTaken ? 'text-stone-400 line-through' : 'text-stone-800'">
                    {{ task.name }}
                  </div>
                  <div class="text-xs mt-0.5" :class="task.isTaken ? 'text-stone-400' : 'text-stone-500'">
                    {{ task.time }} · {{ task.dosage }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 模块 2：功能网格导航 -->
      <nav aria-label="功能导航">
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="item in features"
            :key="item.title"
            class="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 flex flex-col justify-between aspect-[4/3] transition-all duration-300 ease-out active:scale-95 active:shadow-none cursor-pointer"
            @click="router.push(item.path)"
          >
            <div class="w-11 h-11 rounded-2xl bg-stone-50 flex items-center justify-center text-2xl mb-3">
              {{ item.icon }}
            </div>
            <div>
              <div class="text-sm font-bold text-stone-800 mb-1">{{ item.title }}</div>
              <div class="text-xs text-stone-400 leading-relaxed line-clamp-2">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </nav>

    </main>
  </div>
</template>

<style scoped>
/* 隐藏滚动条以保持界面清爽 (如有横向滚动需求时使用) */
::-webkit-scrollbar {
  display: none;
}
</style>