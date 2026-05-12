<script setup>
import { ref } from 'vue'

const keyword = ref('')
const pharmacies = ref([
  { id: 1, name: '老百姓大药房', dist: '500m', addr: '某某路128号', hours: '08:00-22:00', phone: '021-12345678', rating: 4.8 },
  { id: 2, name: '益丰大药房', dist: '800m', addr: '某某路256号', hours: '07:30-23:00', phone: '021-87654321', rating: 4.6 },
  { id: 3, name: '国大药房', dist: '1.2km', addr: '某某路399号', hours: '09:00-21:00', phone: '021-56781234', rating: 4.5 },
  { id: 4, name: '海王星辰', dist: '1.5km', addr: '某某路500号', hours: '08:30-22:30', phone: '021-43218765', rating: 4.3 },
])

const filtered = ref(pharmacies.value)

function search() {
  if (!keyword.value.trim()) {
    filtered.value = pharmacies.value
    return
  }
  const kw = keyword.value.toLowerCase()
  filtered.value = pharmacies.value.filter(
    p => p.name.toLowerCase().includes(kw) || p.addr.toLowerCase().includes(kw)
  )
}

function dial(phone) {
  window.location.href = 'tel:' + phone
}
</script>

<template>
  <div class="p-4">
    <h2 class="text-lg font-bold text-stone-800 mb-4">附近药店</h2>

    <!-- 搜索框 -->
    <div class="relative mb-4">
      <input
        v-model="keyword"
        class="w-full border border-stone-200 rounded-xl px-4 h-11 text-sm pl-10 bg-white"
        placeholder="搜索药店名称或地址..."
        @input="search"
      />
      <span class="absolute left-3 top-3 text-stone-400 text-sm">🔍</span>
    </div>

    <!-- 地图占位 -->
    <div class="bg-stone-200 rounded-2xl h-36 mb-4 flex items-center justify-center text-stone-400 text-sm">
      📍 附近药店地图（接入地图API后可展示）
    </div>

    <!-- 药店列表 -->
    <div class="space-y-3">
      <div
        v-for="p in filtered"
        :key="p.id"
        class="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 transition-all active:scale-98"
      >
        <div class="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-lg flex-shrink-0">
          🏪
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start">
            <div>
              <span class="font-bold text-stone-800 text-sm">{{ p.name }}</span>
              <span class="text-xs text-orange-500 font-bold ml-2">{{ p.dist }}</span>
            </div>
            <span class="text-xs text-amber-500 font-bold">★ {{ p.rating }}</span>
          </div>
          <div class="text-xs text-stone-400 mt-1">{{ p.addr }}</div>
          <div class="text-xs text-stone-300 mt-0.5">营业时间：{{ p.hours }}</div>
        </div>
        <button
          class="w-11 h-11 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-none cursor-pointer transition-all active:scale-90"
          @click="dial(p.phone)"
        >
          📞
        </button>
      </div>
    </div>
  </div>
</template>
