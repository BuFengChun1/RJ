<script setup>
import { ref, computed } from 'vue'

const showForm = ref(false)
const showConfirm = ref(false)
const delTarget = ref(null)

const medicines = ref([
  { id: 1, name: '阿莫西林', member: '爸爸', exp: '2026-06-15', dose: '每日3次，每次1粒', note: '饭后服用' },
  { id: 2, name: '布洛芬', member: '妈妈', exp: '2026-03-20', dose: '每日2次，每次1粒', note: '头痛时服用' },
  { id: 3, name: '维生素C', member: '孩子', exp: '2027-01-10', dose: '每日1次，每次1粒', note: '早晚均可' },
])

const form = ref({ name: '', member: '', exp: '', dose: '', note: '' })

function daysLeft(exp) {
  return Math.ceil((new Date(exp) - new Date()) / (1000 * 60 * 60 * 24))
}

const expWarnings = computed(() =>
  medicines.value.filter(m => daysLeft(m.exp) <= 30)
)

function expStatus(exp) {
  const d = daysLeft(exp)
  if (d < 0) return 'expired'
  if (d <= 30) return 'warning'
  return 'normal'
}

function expLabel(exp) {
  const d = daysLeft(exp)
  if (d < 0) return `已过期${Math.abs(d)}天`
  if (d <= 30) return `${d}天后到期`
  return `至${exp}`
}

function addMedicine() {
  if (!form.value.name || !form.value.member) return
  medicines.value.push({ id: Date.now(), ...form.value })
  form.value = { name: '', member: '', exp: '', dose: '', note: '' }
  showForm.value = false
}

function requestDelete(med) {
  delTarget.value = med
  showConfirm.value = true
}

function confirmDelete() {
  medicines.value = medicines.value.filter(m => m.id !== delTarget.value.id)
  showConfirm.value = false
  delTarget.value = null
}

function cancelDelete() {
  showConfirm.value = false
  delTarget.value = null
}
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold text-stone-800">家庭药品清单</h2>
      <button
        class="bg-orange-500 text-white px-4 h-11 rounded-full text-sm font-bold transition-all active:scale-95 active:opacity-80"
        @click="showForm = !showForm"
      >
        {{ showForm ? '取消' : '+ 添加' }}
      </button>
    </div>

    <!-- 添加表单 -->
    <div v-if="showForm" class="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <div class="grid grid-cols-2 gap-3">
        <input v-model="form.name" placeholder="药品名称*" class="border border-stone-200 rounded-lg px-3 h-11 text-sm col-span-2" />
        <input v-model="form.member" placeholder="使用成员*" class="border border-stone-200 rounded-lg px-3 h-11 text-sm" />
        <input v-model="form.exp" type="date" placeholder="有效期" class="border border-stone-200 rounded-lg px-3 h-11 text-sm" />
        <input v-model="form.dose" placeholder="服用剂量" class="border border-stone-200 rounded-lg px-3 h-11 text-sm col-span-2" />
        <input v-model="form.note" placeholder="备注" class="border border-stone-200 rounded-lg px-3 h-11 text-sm col-span-2" />
      </div>
      <button
        class="mt-3 w-full bg-orange-500 text-white h-11 rounded-lg text-sm font-bold transition-all active:scale-95 active:opacity-80"
        @click="addMedicine"
      >
        确认添加
      </button>
    </div>

    <!-- 过期预警 -->
    <div v-if="expWarnings.length" class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
      ⚠️ 有效期预警：{{ expWarnings.map(m => m.name).join('、') }} 需要关注
    </div>

    <!-- 空状态 -->
    <div v-if="medicines.length === 0" class="text-center py-16">
      <div class="text-5xl mb-3">💊</div>
      <p class="text-stone-400 text-sm">药箱空空如也，全家健健康康</p>
      <button
        class="mt-4 bg-orange-500 text-white px-6 h-11 rounded-full text-sm font-bold transition-all active:scale-95"
        @click="showForm = true"
      >
        + 添加药品
      </button>
    </div>

    <!-- 药品列表 -->
    <div v-else class="space-y-3">
      <div
        v-for="m in medicines"
        :key="m.id"
        class="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3 transition-all active:scale-98"
        :class="expStatus(m.exp) === 'expired' ? 'opacity-70' : ''"
      >
        <div class="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-lg flex-shrink-0">
          💊
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-2">
              <span
                class="font-bold text-stone-800 text-sm"
                :class="expStatus(m.exp) === 'expired' ? 'line-through' : ''"
              >{{ m.name }}</span>
              <span
                v-if="expStatus(m.exp) === 'warning'"
                class="text-xs bg-amber-100 text-amber-500 px-1.5 py-0.5 rounded-full"
              >临期</span>
              <span
                v-if="expStatus(m.exp) === 'expired'"
                class="text-xs bg-rose-100 text-rose-500 px-1.5 py-0.5 rounded-full"
              >已过期</span>
            </div>
            <button
              class="text-stone-300 text-lg leading-none ml-2 h-6 w-6 flex items-center justify-center transition-all active:scale-90"
              @click="requestDelete(m)"
            >×</button>
          </div>
          <div class="text-xs text-stone-400 mt-0.5">{{ m.member }}</div>
          <div class="text-xs text-stone-500 mt-1">{{ m.dose }}</div>
          <div v-if="m.note" class="text-xs text-stone-400 mt-0.5">{{ m.note }}</div>
          <div class="text-xs mt-1" :class="{
            'text-stone-400': expStatus(m.exp) === 'normal',
            'text-amber-500 font-bold': expStatus(m.exp) === 'warning',
            'text-rose-500 font-bold': expStatus(m.exp) === 'expired',
          }">{{ expLabel(m.exp) }}</div>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showConfirm" class="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-xs shadow-lg">
        <div class="text-center text-4xl mb-3">🗑️</div>
        <p class="text-sm text-stone-800 text-center mb-1 font-bold">确认删除</p>
        <p class="text-xs text-stone-400 text-center mb-5">
          确定要将 <span class="text-stone-800 font-bold">{{ delTarget?.name }}</span> 移出家庭药箱吗？
        </p>
        <div class="flex gap-3">
          <button
            class="flex-1 h-11 border border-stone-200 text-stone-500 rounded-lg text-sm transition-all active:scale-95"
            @click="cancelDelete"
          >取消</button>
          <button
            class="flex-1 h-11 bg-rose-500 text-white rounded-lg text-sm font-bold transition-all active:scale-95"
            @click="confirmDelete"
          >确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>
