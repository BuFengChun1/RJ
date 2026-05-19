<script setup lang="ts">
/**
 * 页面名称：用药提醒 (Pill Reminder)
 * 相对地址：src/views/Reminder.vue
 * 功能概括：设置和管理服药时间。支持添加提醒任务、开关提醒开关以及服药记录打卡，确保家人按时用药。
 */
import { ref, computed } from 'vue'

// ==========================================
// 1. 类型定义 (Type Definitions)
// ==========================================
interface Reminder {
  id: number
  name: string
  member: string
  time: string
  note: string
  active: boolean
  taken: boolean
}

// 剔除系统生成的字段，用于表单草稿
type DraftReminder = Pick<Reminder, 'name' | 'member' | 'time' | 'note'>

// ==========================================
// 2. 状态管理 (State)
// ==========================================
const initFormState = (): DraftReminder => ({ name: '', member: '', time: '', note: '' })

const showForm = ref<boolean>(false)
const form = ref<DraftReminder>(initFormState())

// 模拟初始数据
const reminders = ref<Reminder[]>([
  { id: 1, name: '阿莫西林胶囊', member: '爸爸', time: '08:00', note: '每日3次，饭后半小时服用', active: true, taken: false },
  { id: 2, name: '复合维生素C', member: '孩子', time: '09:00', note: '每日1次，增强抵抗力', active: true, taken: true },
  { id: 3, name: '布洛芬缓释胶囊', member: '妈妈', time: '20:00', note: '发烧或头痛时服用', active: false, taken: false },
])

// ==========================================
// 3. 核心逻辑 (Computed & Methods)
// ==========================================
// 按时间顺序对提醒进行排序
const sortedReminders = computed<Reminder[]>(() =>
  [...reminders.value].sort((a, b) => a.time.localeCompare(b.time))
)

// 切换提醒开关状态
const toggleReminder = (id: number): void => {
  const r = reminders.value.find(item => item.id === id)
  if (r) r.active = !r.active
}

// 标记/取消标记已服药
const markTaken = (id: number): void => {
  const r = reminders.value.find(item => item.id === id)
  if (r) r.taken = !r.taken
}

// 提交表单保存提醒
const addReminder = (): void => {
  const { name, time } = form.value
  if (!name.trim() || !time) return

  reminders.value.push({
    id: Date.now(),
    ...form.value,
    active: true,
    taken: false
  })
  
  form.value = initFormState()
  showForm.value = false
}

// 删除提醒
const removeReminder = (id: number): void => {
  reminders.value = reminders.value.filter(item => item.id !== id)
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 font-sans pb-12">
    
    <!-- 头部导航 -->
    <header class="px-5 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-stone-50/90 backdrop-blur-md z-10">
      <h2 class="text-xl font-bold text-stone-800 tracking-wide">服药提醒</h2>
      <button
        class="bg-orange-500 text-white px-5 h-11 rounded-full text-sm font-bold shadow-md shadow-orange-500/20 transition-all duration-300 ease-out active:scale-95 hover:bg-orange-600"
        @click="showForm = !showForm"
      >
        {{ showForm ? '取消添加' : '＋ 新 建' }}
      </button>
    </header>

    <main class="px-5 space-y-5">
      
      <!-- 添加表单区域 -->
      <section 
        v-show="showForm" 
        class="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 transition-all duration-300"
      >
        <div class="grid grid-cols-2 gap-4">
          <input v-model="form.name" placeholder="药品名称 *" class="col-span-2 bg-stone-50 border border-transparent focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-4 h-12 text-sm transition-all outline-none text-stone-800 placeholder-stone-400" />
          <input v-model="form.member" placeholder="服用成员 (如: 爸爸)" class="bg-stone-50 border border-transparent focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-4 h-12 text-sm transition-all outline-none text-stone-800 placeholder-stone-400" />
          <input v-model="form.time" type="time" class="bg-stone-50 border border-transparent focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-4 h-12 text-sm transition-all outline-none text-stone-800" />
          <input v-model="form.note" placeholder="补充说明 (选填)" class="col-span-2 bg-stone-50 border border-transparent focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-4 h-12 text-sm transition-all outline-none text-stone-800 placeholder-stone-400" />
        </div>
        <button
          class="mt-5 w-full bg-stone-800 text-white h-12 rounded-xl text-sm font-bold shadow-md shadow-stone-800/10 transition-all duration-300 ease-out active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          :disabled="!form.name || !form.time"
          @click="addReminder"
        >
          保存提醒设定
        </button>
      </section>

      <!-- 空状态 -->
      <section v-if="sortedReminders.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4 opacity-80">⏰</div>
        <h3 class="text-stone-800 font-bold mb-2">还未设定任何提醒</h3>
        <p class="text-stone-400 text-sm">按时服药是早日康复的关键</p>
        <button
          class="mt-6 bg-white text-stone-800 px-6 h-11 rounded-full text-sm font-bold border border-stone-200 shadow-sm transition-all active:scale-95"
          @click="showForm = true"
        >
          新建第一个提醒
        </button>
      </section>

      <!-- 提醒列表 -->
      <section v-else class="space-y-4">
        <article
          v-for="r in sortedReminders"
          :key="r.id"
          class="bg-white rounded-3xl p-5 shadow-sm border flex items-start gap-4 transition-all duration-300 ease-out"
          :class="[
            r.taken ? 'border-emerald-100 bg-emerald-50/30' : 'border-stone-100',
            !r.active && 'opacity-60 grayscale-[10%]'
          ]"
        >
          <!-- 左侧状态图标 -->
          <div 
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors duration-300"
            :class="r.taken ? 'bg-emerald-100 text-emerald-600' : (r.active ? 'bg-orange-50 text-orange-400' : 'bg-stone-100 text-stone-400')"
          >
            {{ r.taken ? '✅' : '⏰' }}
          </div>
          
          <!-- 中间主体信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <div class="flex flex-col">
                <span class="font-bold text-stone-800 text-base" :class="r.taken && 'text-stone-500 line-through'">{{ r.name }}</span>
                <span v-if="r.member" class="text-[11px] text-stone-400 mt-0.5">👤 {{ r.member }}</span>
              </div>
              
              <!-- 删除按钮，提供标准的 44px 触控区 -->
              <button
                class="w-11 h-11 -mt-2 -mr-3 text-stone-300 hover:text-rose-400 flex items-center justify-center text-xl transition-colors rounded-full active:bg-stone-50"
                aria-label="删除此提醒"
                @click="removeReminder(r.id)"
              >
                ×
              </button>
            </div>
            
            <div v-if="r.note" class="text-xs text-stone-500 mt-2 leading-relaxed">{{ r.note }}</div>
            
            <!-- 底部操作区：时间与打卡 -->
            <div class="flex items-center gap-3 mt-3">
              <span class="text-lg font-bold font-mono tracking-tight" :class="r.active && !r.taken ? 'text-orange-500' : 'text-stone-400'">
                {{ r.time }}
              </span>
              
              <button
                v-if="r.active"
                class="h-8 px-4 rounded-full text-xs font-bold transition-all duration-300 active:scale-95"
                :class="r.taken ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'"
                @click="markTaken(r.id)"
              >
                {{ r.taken ? '已服药 ✓' : '标记已服' }}
              </button>
            </div>
          </div>

          <!-- 右侧自定义 Switch 开关 -->
          <button
            role="switch"
            :aria-checked="r.active"
            class="relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-2 flex-shrink-0 mt-1 cursor-pointer"
            :class="r.active ? 'bg-orange-500' : 'bg-stone-300'"
            @click="toggleReminder(r.id)"
          >
            <span
              class="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out"
              :class="r.active ? 'translate-x-5' : 'translate-x-0'"
            />
          </button>
        </article>
      </section>

    </main>
  </div>
</template>