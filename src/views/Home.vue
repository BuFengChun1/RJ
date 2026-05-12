<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return '早上好 ☀️'
  if (h < 18) return '下午好 🌤️'
  return '晚上好 🌙'
})

const features = [
  { title: '录入药品', desc: '管理家庭成员的药品信息与有效期', icon: '💊', path: '/medicine' },
  { title: '服药提醒', desc: '定时推送提醒，不错过每次用药', icon: '⏰', path: '/reminder' },
  { title: '有效期预警', desc: '临期药品自动高亮，及时更换', icon: '⚠️', path: '/medicine' },
  { title: '附近药店', desc: '快速查找周边药店，一键拨号', icon: '📍', path: '/pharmacy' },
]
</script>

<template>
  <div class="p-4">
    <div class="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white mb-5">
      <h2 class="text-xl font-bold mb-1">{{ greeting }}</h2>
      <p class="text-sm opacity-85">守护家人健康，从药品管理开始</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div
        v-for="item in features"
        :key="item.title"
        class="bg-white rounded-2xl p-4 shadow-sm transition-all active:scale-95 active:opacity-80 cursor-pointer"
        @click="router.push(item.path)"
      >
        <div class="text-3xl mb-2">{{ item.icon }}</div>
        <div class="text-sm font-bold text-stone-800 mb-1">{{ item.title }}</div>
        <div class="text-xs text-stone-400 leading-relaxed">{{ item.desc }}</div>
      </div>
    </div>
  </div>
</template>
