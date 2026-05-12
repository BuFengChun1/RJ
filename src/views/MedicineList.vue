<script setup lang="ts">
import { ref, computed } from 'vue'

// ==========================================
// 1. 类型定义 (Type Definitions)
// ==========================================
interface Medicine {
  id: number
  name: string
  member: string
  exp: string
  dose: string
  note: string
}

type DraftMedicine = Omit<Medicine, 'id'>

type ExpiryStatus = 'expired' | 'warning' | 'normal'

// ==========================================
// 2. 状态管理 (State)
// ==========================================
const showForm = ref<boolean>(false)
const showConfirm = ref<boolean>(false)
const delTarget = ref<Medicine | null>(null)

// 模拟数据
const medicines = ref<Medicine[]>([
  { id: 1, name: '阿莫西林胶囊', member: '爸爸', exp: '2026-06-15', dose: '每日3次，每次1粒', note: '饭后半小时服用' },
  { id: 2, name: '布洛芬缓释胶囊', member: '妈妈', exp: '2026-03-20', dose: '每日2次，每次1粒', note: '发烧或头痛时服用' },
  { id: 3, name: '复合维生素C', member: '孩子', exp: '2027-01-10', dose: '每日1次，每次1粒', note: '早晚均可' },
])

const initFormState = (): DraftMedicine => ({ name: '', member: '', exp: '', dose: '', note: '' })
const form = ref<DraftMedicine>(initFormState())

// ==========================================
// 3. 核心逻辑 (Computed & Methods)
// ==========================================
const daysLeft = (exp: string): number => {
  // 抹平时间差，仅计算日期天数
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expDate = new Date(exp)
  expDate.setHours(0, 0, 0, 0)
  return Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

const expWarnings = computed<Medicine[]>(() =>
  medicines.value.filter(m => daysLeft(m.exp) <= 30)
)

const getExpStatus = (exp: string): ExpiryStatus => {
  const d = daysLeft(exp)
  if (d < 0) return 'expired'
  if (d <= 30) return 'warning'
  return 'normal'
}

const getExpLabel = (exp: string): string => {
  const d = daysLeft(exp)
  if (d < 0) return `已过期 ${Math.abs(d)} 天`
  if (d <= 30) return `仅剩 ${d} 天到期`
  return `有效期至 ${exp}`
}

// 交互动作
const addMedicine = (): void => {
  if (!form.value.name.trim() || !form.value.member.trim()) return // 简易校验拦截
  medicines.value.unshift({ id: Date.now(), ...form.value }) // 新添加的放到最前
  form.value = initFormState()
  showForm.value = false
}

const requestDelete = (med: Medicine): void => {
  delTarget.value = med
  showConfirm.value = true
}

const confirmDelete = (): void => {
  if (!delTarget.value) return
  medicines.value = medicines.value.filter(m => m.id !== delTarget.value!.id)
  showConfirm.value = false
  delTarget.value = null
}

const cancelDelete = (): void => {
  showConfirm.value = false
  delTarget.value = null
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 font-sans pb-12">
    
    <!-- 头部导航 -->
    <header class="px-5 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-stone-50/90 backdrop-blur-md z-10">
      <h2 class="text-xl font-bold text-stone-800 tracking-wide">家庭药品清单</h2>
      <button
        class="bg-orange-500 text-white px-5 h-10 rounded-full text-sm font-bold shadow-md shadow-orange-500/20 transition-all duration-300 ease-out active:scale-95 hover:bg-orange-600"
        @click="showForm = !showForm"
      >
        {{ showForm ? '取消添加' : '＋ 添 加' }}
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
          <input v-model="form.member" placeholder="使用成员 *" class="bg-stone-50 border border-transparent focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-4 h-12 text-sm transition-all outline-none text-stone-800 placeholder-stone-400" />
          <input v-model="form.exp" type="date" placeholder="有效期" class="bg-stone-50 border border-transparent focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-4 h-12 text-sm transition-all outline-none text-stone-800 placeholder-stone-400" />
          <input v-model="form.dose" placeholder="服用剂量 (如: 每日2次)" class="col-span-2 bg-stone-50 border border-transparent focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-4 h-12 text-sm transition-all outline-none text-stone-800 placeholder-stone-400" />
          <input v-model="form.note" placeholder="补充备注 (选填)" class="col-span-2 bg-stone-50 border border-transparent focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-4 h-12 text-sm transition-all outline-none text-stone-800 placeholder-stone-400" />
        </div>
        <button
          class="mt-5 w-full bg-stone-800 text-white h-12 rounded-xl text-sm font-bold shadow-md shadow-stone-800/10 transition-all duration-300 ease-out active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          :disabled="!form.name || !form.member"
          @click="addMedicine"
        >
          保存药品信息
        </button>
      </section>

      <!-- 临期/过期预警 -->
      <section v-if="expWarnings.length" class="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3 items-start shadow-sm">
        <span class="text-xl leading-none mt-0.5">⚠️</span>
        <div>
          <h4 class="text-sm font-bold text-orange-800 mb-1">有效期预警</h4>
          <p class="text-xs text-orange-600/90 leading-relaxed">
            您有 {{ expWarnings.length }} 款药品即将或已过期（{{ expWarnings.map(m => m.name).join('、') }}），请及时排查清理。
          </p>
        </div>
      </section>

      <!-- 药品列表 -->
      <section v-if="medicines.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4 opacity-80">🪴</div>
        <h3 class="text-stone-800 font-bold mb-2">药箱空空如也</h3>
        <p class="text-stone-400 text-sm">全家健健康康，就是最好的状态</p>
        <button
          class="mt-6 bg-white text-stone-800 px-6 h-11 rounded-full text-sm font-bold border border-stone-200 shadow-sm transition-all active:scale-95"
          @click="showForm = true"
        >
          录入首个药品
        </button>
      </section>

      <section v-else class="space-y-4">
        <article
          v-for="m in medicines"
          :key="m.id"
          class="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 flex gap-4 transition-all duration-300 ease-out active:scale-[0.98]"
          :class="{ 'opacity-60 grayscale-[30%]': getExpStatus(m.exp) === 'expired' }"
        >
          <!-- 左侧图标 -->
          <div class="w-12 h-12 bg-orange-50 text-orange-400 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            💊
          </div>
          
          <!-- 右侧信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-2 flex-wrap pr-2">
                <span class="font-bold text-stone-800 text-base" :class="{ 'line-through text-stone-500': getExpStatus(m.exp) === 'expired' }">
                  {{ m.name }}
                </span>
                <span v-if="getExpStatus(m.exp) === 'warning'" class="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">
                  临期
                </span>
                <span v-if="getExpStatus(m.exp) === 'expired'" class="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                  已过期
                </span>
              </div>
              
              <!-- 放大触控区域的删除按钮 -->
              <button
                class="w-11 h-11 -mt-2 -mr-3 text-stone-300 hover:text-rose-400 flex items-center justify-center text-xl transition-colors rounded-full active:bg-stone-50"
                aria-label="删除药品"
                @click="requestDelete(m)"
              >
                ×
              </button>
            </div>
            
            <div class="text-sm text-orange-600/80 font-medium mt-1">👤 {{ m.member }}</div>
            <div class="text-xs text-stone-500 mt-1.5 leading-relaxed">{{ m.dose }}</div>
            <div v-if="m.note" class="text-xs text-stone-400 mt-1 bg-stone-50 p-2 rounded-lg">📝 {{ m.note }}</div>
            
            <div class="text-xs mt-3 font-medium flex items-center gap-1" :class="{
              'text-stone-400': getExpStatus(m.exp) === 'normal',
              'text-amber-500': getExpStatus(m.exp) === 'warning',
              'text-rose-500': getExpStatus(m.exp) === 'expired',
            }">
              <span>⏳</span> {{ getExpLabel(m.exp) }}
            </div>
          </div>
        </article>
      </section>

    </main>

    <!-- 沉浸式删除确认弹窗 -->
    <dialog 
      v-if="showConfirm" 
      class="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-5 m-0 w-full h-full"
      open
    >
      <div class="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          🗑️
        </div>
        <h3 class="text-lg text-stone-800 text-center mb-2 font-bold">确认移出药箱？</h3>
        <p class="text-sm text-stone-500 text-center mb-6 leading-relaxed px-2">
          确定要将 <span class="text-stone-800 font-bold">"{{ delTarget?.name }}"</span> 移出清单吗？此操作不可恢复。
        </p>
        <div class="flex gap-3">
          <button
            class="flex-1 h-12 bg-stone-100 text-stone-600 rounded-xl text-sm font-bold transition-all duration-300 active:scale-95 hover:bg-stone-200"
            @click="cancelDelete"
          >
            我再想想
          </button>
          <button
            class="flex-1 h-12 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-500/20 transition-all duration-300 active:scale-95 hover:bg-rose-600"
            @click="confirmDelete"
          >
            确认移出
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
/* UnoCSS 会自动处理，这里可以预留一些特殊动画 */
@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-in {
  animation: zoom-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>