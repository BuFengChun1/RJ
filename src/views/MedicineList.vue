<script setup>
import { ref, computed } from 'vue'

const showForm = ref(false)
const medicines = ref([
  { id: 1, name: '阿莫西林', member: '爸爸', exp: '2026-06-15', dose: '每日3次，每次1粒', note: '饭后服用' },
  { id: 2, name: '布洛芬', member: '妈妈', exp: '2026-03-20', dose: '每日2次，每次1粒', note: '头痛时服用' },
  { id: 3, name: '维生素C', member: '孩子', exp: '2027-01-10', dose: '每日1次，每次1粒', note: '早晚均可' },
])

const form = ref({ name: '', member: '', exp: '', dose: '', note: '' })

function daysLeft(exp) {
  const d = Math.ceil((new Date(exp) - new Date()) / (1000 * 60 * 60 * 24))
  return d
}

function expClass(exp) {
  const d = daysLeft(exp)
  if (d <= 0) return 'text-red-500 font-bold'
  if (d <= 30) return 'text-orange-500 font-bold'
  return 'text-gray-500'
}

function expLabel(exp) {
  const d = daysLeft(exp)
  if (d <= 0) return `已过期${Math.abs(d)}天`
  if (d <= 30) return `剩余${d}天`
  return `至${exp}`
}

function addMedicine() {
  if (!form.value.name || !form.value.member) return
  medicines.value.push({ id: Date.now(), ...form.value })
  form.value = { name: '', member: '', exp: '', dose: '', note: '' }
  showForm.value = false
}

function removeMedicine(id) {
  medicines.value = medicines.value.filter(m => m.id !== id)
}
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold text-gray-800">家庭药品清单</h2>
      <button
        class="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm"
        @click="showForm = !showForm"
      >
        {{ showForm ? '取消' : '+ 添加' }}
      </button>
    </div>

    <!-- 添加表单 -->
    <div v-if="showForm" class="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <div class="grid grid-cols-2 gap-3">
        <input v-model="form.name" placeholder="药品名称*" class="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2" />
        <input v-model="form.member" placeholder="使用成员*" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        <input v-model="form.exp" type="date" placeholder="有效期" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        <input v-model="form.dose" placeholder="服用剂量" class="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2" />
        <input v-model="form.note" placeholder="备注" class="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2" />
      </div>
      <button
        class="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg text-sm"
        @click="addMedicine"
      >
        确认添加
      </button>
    </div>

    <!-- 过期预警 -->
    <div class="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-sm text-orange-700">
      ⚠️ 过期预警：布洛芬 即将过期，请及时更换
    </div>

    <!-- 药品列表 -->
    <div class="space-y-3">
      <div
        v-for="m in medicines"
        :key="m.id"
        class="bg-white rounded-xl p-4 shadow-sm flex items-start gap-3"
      >
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
          💊
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <div>
              <span class="font-bold text-gray-800 text-sm">{{ m.name }}</span>
              <span class="text-xs text-gray-400 ml-2">{{ m.member }}</span>
            </div>
            <button class="text-gray-300 text-lg leading-none ml-2" @click="removeMedicine(m.id)">×</button>
          </div>
          <div class="text-xs text-gray-500 mt-1">{{ m.dose }}</div>
          <div class="text-xs text-gray-400 mt-0.5">{{ m.note }}</div>
          <div class="text-xs mt-1" :class="expClass(m.exp)">{{ expLabel(m.exp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
