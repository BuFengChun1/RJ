<script setup lang="ts">
import { ref, computed } from 'vue'

// ==== Mock 路由与导航数据 ====
const currentPath = ref('/reminder')
const tabs = [
  { path: '/', name: '首页', iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/medicine', name: '药品', iconPath: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { path: '/reminder', name: '提醒', iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { path: '/pharmacy', name: '药店', iconPath: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
]

// ==== Mock 提醒任务数据 ====
interface Reminder {
  id: number
  time: string
  person: string
  medicine: string
  dose: string
  tag: string
  isTaken: boolean
  theme: 'blue' | 'rose' | 'emerald' | 'amber'
}

const reminders = ref<Reminder[]>([
  { id: 1, time: '08:00', person: '爷爷', medicine: '阿司匹林肠溶片', dose: '1粒 (100mg)', tag: '饭前', isTaken: true, theme: 'blue' },
  { id: 2, time: '08:30', person: '奶奶', medicine: '降压药 (氨氯地平)', dose: '1片 (5mg)', tag: '饭后', isTaken: false, theme: 'rose' },
  { id: 3, time: '12:30', person: '爷爷', medicine: '二甲双胍缓释片', dose: '2粒 (1000mg)', tag: '随餐', isTaken: false, theme: 'blue' },
  { id: 4, time: '20:00', person: '自己', medicine: '维生素 C 泡腾片', dose: '1片', tag: '睡前', isTaken: false, theme: 'emerald' },
])

// ==== 状态计算与交互逻辑 ====
const completedCount = computed(() => reminders.value.filter(r => r.isTaken).length)
const totalCount = computed(() => reminders.value.length)
const progressPercent = computed(() => totalCount.value === 0 ? 0 : (completedCount.value / totalCount.value) * 100)

const toggleStatus = (item: Reminder) => {
  item.isTaken = !item.isTaken
}

// ==== 底部弹窗逻辑 ====
const showAddSheet = ref(false)
const openAddSheet = () => showAddSheet.value = true
const closeAddSheet = () => showAddSheet.value = false

// ==== 辅助函数：卡片配色 ====
const getCardClass = (item: Reminder) => {
  if (item.isTaken) return 'bg-slate-100 border border-slate-200/60 opacity-60'
  const themes = {
    blue: 'bg-blue-50 border border-blue-100',
    rose: 'bg-rose-50 border border-rose-100',
    emerald: 'bg-emerald-50 border border-emerald-100',
    amber: 'bg-amber-50 border border-amber-100',
  }
  return themes[item.theme]
}

const getTagClass = (item: Reminder) => {
  if (item.isTaken) return 'bg-slate-200 text-slate-500'
  const themes = {
    blue: 'bg-blue-100 text-blue-700',
    rose: 'bg-rose-100 text-rose-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
  }
  return themes[item.theme]
}
</script>

<template>
  <div class="h-screen w-full bg-slate-50 flex flex-col font-sans overflow-hidden text-slate-900">
    
    <!-- Header 区域 (Material 3 大字号与胶囊进度条) -->
    <header class="pt-16 pb-6 px-6 flex-shrink-0 z-10 bg-slate-50">
      <h1 class="text-3xl leading-snug font-extrabold tracking-tight text-slate-800">
        早上好，<br/>
        今天有 <span class="text-emerald-500">{{ totalCount }}</span> 个用药提醒
      </h1>
      
      <!-- 胶囊进度条 -->
      <div class="mt-6 flex items-center gap-4">
        <div class="flex-1 h-3.5 bg-slate-200 rounded-full overflow-hidden relative">
          <div 
            class="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
        <span class="text-sm font-bold text-slate-500 w-12 text-right">{{ completedCount }}/{{ totalCount }}</span>
      </div>
    </header>

    <!-- 主内容区 (灵动卡片列表) -->
    <main class="flex-1 overflow-y-auto px-5 pb-36 space-y-4">
      <div 
        v-for="item in reminders" 
        :key="item.id"
        @click="toggleStatus(item)"
        class="rounded-[24px] p-5 flex items-center justify-between cursor-pointer transition-all duration-300 ease-out active:scale-[0.96]"
        :class="getCardClass(item)"
      >
        <!-- 左侧与中间信息区 -->
        <div class="flex items-center gap-5">
          <!-- 时间与人员 (Figma 模块化排版) -->
          <div class="flex flex-col items-start min-w-[56px]">
            <span class="text-2xl font-black tracking-tighter" :class="item.isTaken ? 'text-slate-400' : 'text-slate-800'">
              {{ item.time }}
            </span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-md mt-1 transition-colors"
                  :class="getTagClass(item)">
              {{ item.person }}
            </span>
          </div>
          
          <!-- 药品与备注 -->
          <div class="flex flex-col justify-center">
            <h3 class="text-[17px] font-bold" :class="item.isTaken ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'">
              {{ item.medicine }}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[13px] font-medium" :class="item.isTaken ? 'text-slate-400' : 'text-slate-500'">
                {{ item.dose }}
              </span>
              <span class="w-1 h-1 rounded-full bg-slate-300"></span>
              <span class="text-[13px] font-medium" :class="item.isTaken ? 'text-slate-400' : 'text-slate-500'">
                {{ item.tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- 右侧 MD3 风格巨大 Toggle / Check -->
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
          :class="item.isTaken ? 'bg-emerald-500 shadow-sm' : 'bg-white shadow-sm border border-slate-200'"
        >
          <svg v-if="item.isTaken" class="w-6 h-6 text-white scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div v-else class="w-4 h-4 rounded-full border-2 border-slate-300"></div>
        </div>
      </div>
    </main>

    <!-- MD3 风格悬浮按钮 (FAB) -->
    <button 
      @click="openAddSheet"
      class="fixed bottom-28 right-6 w-16 h-16 bg-emerald-500 text-white rounded-[20px] shadow-lg shadow-emerald-500/30 flex items-center justify-center active:scale-90 active:bg-emerald-600 transition-all duration-200 z-40"
    >
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round" />
        <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round" />
      </svg>
    </button>

    <!-- 底部导航栏 (Material You 药丸选中态) -->
    <nav class="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 flex justify-around items-center pb-safe pt-2 h-[88px] shadow-[0_-4px_20px_rgb(0,0,0,0.02)]">
      <div 
        v-for="tab in tabs" 
        :key="tab.path"
        class="flex flex-col items-center justify-center w-16 h-full cursor-pointer relative group"
      >
        <!-- 药丸状高亮背景 -->
        <div class="absolute top-1 w-14 h-8 rounded-full transition-colors duration-300 -z-10"
             :class="currentPath === tab.path ? 'bg-emerald-100' : 'bg-transparent group-hover:bg-slate-50'"></div>
        
        <svg class="w-6 h-6 mb-1.5 transition-colors duration-300 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" 
             :stroke-width="currentPath === tab.path ? '2.5' : '2'"
             :class="currentPath === tab.path ? 'text-emerald-800' : 'text-slate-400'">
          <path :d="tab.iconPath" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="text-[11px] font-bold transition-colors duration-300"
              :class="currentPath === tab.path ? 'text-emerald-800' : 'text-slate-400'">
          {{ tab.name }}
        </span>
      </div>
    </nav>

    <!-- 半屏弹窗 (Bottom Sheet) 遮罩 -->
    <Transition name="fade">
      <div v-if="showAddSheet" @click="closeAddSheet" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100]"></div>
    </Transition>

    <!-- 半屏弹窗内容 -->
    <Transition name="slide-up">
      <div v-if="showAddSheet" class="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 z-[101] shadow-2xl pb-safe">
        <!-- 顶部拖拽指示条 -->
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
        <h2 class="text-[22px] font-extrabold text-slate-800 mb-6">添加新提醒</h2>
        
        <!-- Figma 风格大色块输入框 -->
        <div class="space-y-4 mb-8">
          <input type="text" placeholder="药品名称 (如: 降压药)" 
                 class="w-full bg-slate-100 text-slate-800 placeholder-slate-400 rounded-2xl p-4 text-[16px] font-medium outline-none focus:ring-2 focus:ring-emerald-400 transition-all border-none" />
          
          <div class="flex gap-4">
            <select class="flex-1 bg-slate-100 text-slate-800 font-medium rounded-2xl p-4 text-[16px] outline-none appearance-none focus:ring-2 focus:ring-emerald-400 transition-all border-none">
              <option value="" disabled selected>服药人</option>
              <option>爷爷 (蓝)</option>
              <option>奶奶 (粉)</option>
              <option>自己 (绿)</option>
            </select>
            
            <input type="time" class="flex-1 bg-slate-100 text-slate-800 font-medium rounded-2xl p-4 text-[16px] outline-none focus:ring-2 focus:ring-emerald-400 transition-all border-none" />
          </div>
          
          <input type="text" placeholder="剂量与频次 (如: 饭后 1片)" 
                 class="w-full bg-slate-100 text-slate-800 placeholder-slate-400 rounded-2xl p-4 text-[16px] font-medium outline-none focus:ring-2 focus:ring-emerald-400 transition-all border-none" />
        </div>

        <!-- 全圆角活力提交按钮 -->
        <button @click="closeAddSheet" class="w-full h-14 bg-emerald-500 text-white text-[17px] font-bold rounded-full active:scale-[0.97] active:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all duration-200">
          保存提醒
        </button>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* 适配 iOS 底部安全区 */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 24px);
}

/* 隐藏原生 time input 的 icon 保证纯粹的UI */
input[type="time"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}
input[type="time"] {
  position: relative;
}

/* 动画特效 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}

.scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
</style>