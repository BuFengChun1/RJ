<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { path: '/', name: '首页', icon: '🏠' },
  { path: '/medicine', name: '药品', icon: '💊' },
  { path: '/reminder', name: '提醒', icon: '⏰' },
  { path: '/pharmacy', name: '药店', icon: '📍' },
]
</script>

<template>
  <div class="h-screen flex flex-col bg-stone-50">
    <header class="sticky top-0 z-50 bg-white border-b border-stone-100 px-4 py-3 text-center flex-shrink-0">
      <h1 class="text-base font-bold text-stone-800">家庭药品管理</h1>
    </header>
    <main class="flex-1 overflow-auto pb-15">
      <router-view />
    </main>
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-100 flex">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="flex-1 flex flex-col items-center py-2 text-xs transition-all no-underline h-15 justify-center"
        :class="route.path === tab.path ? 'text-orange-500' : 'text-stone-400'"
      >
        <span class="text-xl mb-0.5" :class="route.path === tab.path ? 'scale-110 font-bold' : ''">{{ tab.icon }}</span>
        {{ tab.name }}
      </router-link>
    </nav>
  </div>
</template>
