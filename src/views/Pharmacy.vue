<script setup>
import { ref } from 'vue'

const keyword = ref('')
const pharmacies = ref([
  { id: 1, name: '老百姓大药房', addr: '距离约500m · 某某路128号', phone: '021-12345678', rating: 4.8 },
  { id: 2, name: '益丰大药房', addr: '距离约800m · 某某路256号', phone: '021-87654321', rating: 4.6 },
  { id: 3, name: '国大药房', addr: '距离约1.2km · 某某路399号', phone: '021-56781234', rating: 4.5 },
  { id: 4, name: '海王星辰', addr: '距离约1.5km · 某某路500号', phone: '021-43218765', rating: 4.3 },
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
</script>

<template>
  <div class="p-4">
    <h2 class="text-lg font-bold text-gray-800 mb-4">附近药店</h2>

    <!-- 搜索框 -->
    <div class="relative mb-4">
      <input
        v-model="keyword"
        class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm pl-10"
        placeholder="搜索药店名称或地址..."
        @input="search"
      />
      <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
    </div>

    <!-- 地图占位 -->
    <div class="bg-gray-200 rounded-xl h-40 mb-4 flex items-center justify-center text-gray-400 text-sm">
      📍 附近药店地图（需要接入地图API）
    </div>

    <!-- 药店列表 -->
    <div class="space-y-3">
      <div
        v-for="p in filtered"
        :key="p.id"
        class="bg-white rounded-xl p-4 shadow-sm"
      >
        <div class="flex justify-between items-start">
          <div class="font-bold text-gray-800 text-sm">{{ p.name }}</div>
          <span class="text-xs text-orange-500 font-bold">★ {{ p.rating }}</span>
        </div>
        <div class="text-xs text-gray-400 mt-1.5">{{ p.addr }}</div>
        <div class="flex gap-3 mt-2">
          <a :href="'tel:' + p.phone" class="text-xs bg-blue-50 text-blue-500 px-3 py-1 rounded-full no-underline">
            📞 拨打电话
          </a>
          <span class="text-xs bg-green-50 text-green-500 px-3 py-1 rounded-full">
            🧭 导航
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
