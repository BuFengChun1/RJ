<script setup>
import { ref, computed } from 'vue'

const reminders = ref([
  { id: 1, name: '阿莫西林', member: '爸爸', time: '08:00', note: '每日3次，饭后服用', active: true, taken: false },
  { id: 2, name: '维生素C', member: '孩子', time: '09:00', note: '每日1次', active: true, taken: true },
  { id: 3, name: '布洛芬', member: '妈妈', time: '20:00', note: '头痛时服用', active: false, taken: false },
])

const showForm = ref(false)
const form = ref({ name: '', member: '', time: '', note: '' })

const sortedReminders = computed(() =>
  [...reminders.value].sort((a, b) => a.time.localeCompare(b.time))
)

function toggleReminder(id) {
  const r = reminders.value.find(r => r.id === id)
  if (r) r.active = !r.active
}

function markTaken(id) {
  const r = reminders.value.find(r => r.id === id)
  if (r) r.taken = !r.taken
}

function addReminder() {
  if (!form.value.name || !form.value.time) return
  reminders.value.push({ id: Date.now(), ...form.value, active: true, taken: false })
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
      <h2 class="text-lg font-bold text-stone-800">服药提醒</h2>
      <button
        class="bg-orange-500 text-white px-4 h-11 rounded-full text-sm font-bold transition-all active:scale-95 active:opacity-80"
        @click="showForm = !showForm"
      >
        {{ showForm ? '取消' : '+ 新建' }}
      </button>
    </div>

    <!-- 添加表单 -->
    <div v-if="showForm" class="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <div class="grid grid-cols-2 gap-3">
        <input v-model="form.name" placeholder="药品名称*" class="border border-stone-200 rounded-lg px-3 h-11 text-sm col-span-2" />
        <input v-model="form.member" placeholder="服用成员" class="border border-stone-200 rounded-lg px-3 h-11 text-sm" />
        <input v-model="form.time" type="time" placeholder="提醒时间*" class="border border-stone-200 rounded-lg px-3 h-11 text-sm" />
        <input v-model="form.note" placeholder="备注" class="border border-stone-200 rounded-lg px-3 h-11 text-sm col-span-2" />
      </div>
      <button
        class="mt-3 w-full bg-orange-500 text-white h-11 rounded-lg text-sm font-bold transition-all active:scale-95 active:opacity-80"
        @click="addReminder"
      >
        确认添加
      </button>
    </div>

    <!-- 空状态 -->
    <div v-if="sortedReminders.length === 0" class="text-center py-16">
      <div class="text-5xl mb-3">⏰</div>
      <p class="text-stone-400 text-sm">还没有服药提醒，去添加一个吧</p>
      <button
        class="mt-4 bg-orange-500 text-white px-6 h-11 rounded-full text-sm font-bold transition-all active:scale-95"
        @click="showForm = true"
      >
        + 新建提醒
      </button>
    </div>

    <!-- 提醒列表 -->
    <div v-else class="space-y-3">
      <div
        v-for="r in sortedReminders"
        :key="r.id"
        class="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 transition-all active:scale-98"
        :class="r.taken ? 'bg-emerald-50' : ''"
      >
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          :class="r.taken ? 'bg-emerald-100' : (r.active ? 'bg-orange-50' : 'bg-stone-100')">
          {{ r.taken ? '✅' : '⏰' }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <div>
              <span class="font-bold text-stone-800 text-sm">{{ r.name }}</span>
              <span class="text-xs text-stone-400 ml-2">{{ r.member }}</span>
            </div>
            <button
              class="text-stone-300 text-lg leading-none ml-2 h-6 w-6 flex items-center justify-center transition-all active:scale-90"
              @click="removeReminder(r.id)"
            >×</button>
          </div>
          <div class="text-xs text-stone-400 mt-1">{{ r.note }}</div>
          <div class="flex items-center gap-2 mt-1.5">
            <span class="text-sm font-bold" :class="r.active ? 'text-orange-500' : 'text-stone-300'">{{ r.time }}</span>
            <button
              v-if="r.active"
              class="text-xs h-7 px-3 rounded-full transition-all active:scale-95 font-bold"
              :class="r.taken ? 'bg-emerald-100 text-emerald-500' : 'bg-orange-100 text-orange-500'"
              @click="markTaken(r.id)"
            >
              {{ r.taken ? '已服药 ✓' : '标记已服' }}
            </button>
          </div>
        </div>
        <div
          class="w-12 h-7 rounded-full flex items-center px-0.5 cursor-pointer flex-shrink-0 transition-colors"
          :class="r.active ? 'bg-orange-500' : 'bg-stone-300'"
          @click="toggleReminder(r.id)"
        >
          <div
            class="w-5 h-5 bg-white rounded-full shadow transition-transform"
            :class="r.active ? 'translate-x-5' : 'translate-x-0.5'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
