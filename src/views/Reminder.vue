<script setup>
import { ref } from 'vue'

const reminders = ref([
  { id: 1, name: '阿莫西林', member: '爸爸', time: '08:00', note: '每日3次', active: true },
  { id: 2, name: '维生素C', member: '孩子', time: '09:00', note: '每日1次', active: true },
  { id: 3, name: '布洛芬', member: '妈妈', time: '20:00', note: '头痛时服用', active: false },
])

const showForm = ref(false)
const form = ref({ name: '', member: '', time: '', note: '' })

function toggleReminder(id) {
  const r = reminders.value.find(r => r.id === id)
  if (r) r.active = !r.active
}

function addReminder() {
  if (!form.value.name || !form.value.time) return
  reminders.value.push({ id: Date.now(), ...form.value, active: true })
  form.value = { name: '', member: '', time: '', note: '' }
  showForm.value = false
}

function removeReminder(id) {
  reminders.value = reminders.value.filter(r => r.id !== id)
}
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold text-gray-800">服药提醒</h2>
      <button
        class="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm"
        @click="showForm = !showForm"
      >
        {{ showForm ? '取消' : '+ 新建' }}
      </button>
    </div>

    <!-- 添加表单 -->
    <div v-if="showForm" class="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <div class="grid grid-cols-2 gap-3">
        <input v-model="form.name" placeholder="药品名称*" class="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2" />
        <input v-model="form.member" placeholder="服用成员" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        <input v-model="form.time" type="time" placeholder="提醒时间" class="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        <input v-model="form.note" placeholder="备注" class="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2" />
      </div>
      <button
        class="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg text-sm"
        @click="addReminder"
      >
        确认添加
      </button>
    </div>

    <!-- 提醒列表 -->
    <div class="space-y-3">
      <div
        v-for="r in reminders"
        :key="r.id"
        class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
      >
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          :class="r.active ? 'bg-green-100' : 'bg-gray-100'">
          ⏰
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <div>
              <span class="font-bold text-gray-800 text-sm">{{ r.name }}</span>
              <span class="text-xs text-gray-400 ml-2">{{ r.member }}</span>
            </div>
            <button class="text-gray-300 text-lg leading-none ml-2" @click="removeReminder(r.id)">×</button>
          </div>
          <div class="text-xs text-gray-500 mt-1">{{ r.note }}</div>
          <div class="text-sm text-blue-500 font-bold mt-1">{{ r.time }}</div>
        </div>
        <div
          class="w-12 h-6 rounded-full flex items-center px-0.5 cursor-pointer flex-shrink-0 transition-colors"
          :class="r.active ? 'bg-blue-500' : 'bg-gray-300'"
          @click="toggleReminder(r.id)"
        >
          <div
            class="w-5 h-5 bg-white rounded-full shadow transition-transform"
            :class="r.active ? 'translate-x-6' : 'translate-x-0'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
