<script setup lang="ts">
import { computed, ref, watch, provide } from 'vue'
import { useRoute } from 'vue-router'

interface TabItem {
  path: string
  name: string
  icon: string
  activeIcon: string
  desc: string
}

const route = useRoute()

const appMainRef = ref<HTMLElement | null>(null)

watch(
  () => route.path,
  () => {
    // 切换路由时自动回到顶部
    if (appMainRef.value) {
      // 如果需要平滑滚动可以用: appMainRef.value.scrollTo({ top: 0, behavior: 'smooth' })
      appMainRef.value.scrollTop = 0
    }
  }
)

// 全局控制底部导航的显示与隐藏，供弹出层/表单使用
const isTabbarHidden = ref(false)
provide('setTabbarHidden', (hidden: boolean) => {
  isTabbarHidden.value = hidden
})

const tabs: TabItem[] = [
  {
    path: '/',
    name: '首页',
    icon: '⌂',
    activeIcon: '🏠',
    desc: '家庭健康概览',
  },
  {
    path: '/members',
    name: '成员',
    icon: '○',
    activeIcon: '👨‍👩‍👧',
    desc: '管理家庭成员',
  },
  {
    path: '/medicine',
    name: '药品',
    icon: '◌',
    activeIcon: '💊',
    desc: '管理家庭药箱',
  },
  {
    path: '/reminder',
    name: '提醒',
    icon: '◷',
    activeIcon: '⏰',
    desc: '按时用药打卡',
  },
  {
    path: '/pharmacy',
    name: '药店',
    icon: '⌖',
    activeIcon: '📍',
    desc: '附近药店服务',
  },
]

const currentTab = computed(() => {
  return tabs.find((tab) => tab.path === route.path) || tabs[0]
})

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="app-shell">
    <div class="phone-frame">
      <div class="ambient ambient-blue"></div>
      <div class="ambient ambient-green"></div>
      <div class="ambient ambient-purple"></div>

      <main class="app-main" ref="appMainRef">
        <router-view />
      </main>

      <transition name="slide-up-tabbar">
        <nav v-show="!isTabbarHidden" class="tabbar" aria-label="底部导航">
          <router-link
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            class="tab-item"
            :class="{ active: isActive(tab.path) }"
          >
            <span class="tab-icon">
              {{ isActive(tab.path) ? tab.activeIcon : tab.icon }}
            </span>
            <span class="tab-label">{{ tab.name }}</span>
          </router-link>
        </nav>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 10%, rgba(59, 130, 246, 0.16), transparent 28%),
    radial-gradient(circle at 85% 20%, rgba(16, 185, 129, 0.16), transparent 30%),
    linear-gradient(145deg, #f7fbff 0%, #eef8f4 48%, #f8fafc 100%);
  display: flex;
  justify-content: center;
  color: #111827;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Display",
    "SF Pro Text",
    "Segoe UI",
    sans-serif;
}

.phone-frame {
  position: relative;
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.18)),
    linear-gradient(160deg, #f8fbff 0%, #eef8f4 100%);
  box-shadow:
    0 24px 80px rgba(15, 23, 42, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.65);
}

.ambient {
  position: absolute;
  z-index: 0;
  border-radius: 999px;
  filter: blur(34px);
  pointer-events: none;
}

.ambient-blue {
  top: 28px;
  left: -60px;
  width: 190px;
  height: 190px;
  background: rgba(96, 165, 250, 0.22);
}

.ambient-green {
  top: 150px;
  right: -70px;
  width: 210px;
  height: 210px;
  background: rgba(52, 211, 153, 0.18);
}

.ambient-purple {
  bottom: 120px;
  left: 40px;
  width: 180px;
  height: 180px;
  background: rgba(167, 139, 250, 0.12);
}

.app-header.compact {
  position: sticky;
  top: 0;
  z-index: 40;
  padding: calc(12px + env(safe-area-inset-top)) 16px 12px;
  background: rgba(255, 255, 255, 0.65);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
}

.title-block {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-emoji {
  font-size: 20px;
  line-height: 1;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}

.header-status-mini {
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #047857;
  background: rgba(236, 253, 245, 0.8);
  border: 1px solid rgba(167, 243, 208, 0.6);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

/* 导航切换动画 */
.slide-up-tabbar-enter-active,
.slide-up-tabbar-leave-active {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease;
}

.slide-up-tabbar-enter-from,
.slide-up-tabbar-leave-to {
  opacity: 0;
  /* 因为自身有 transform: translateX(-50%)，这里做动画偏移兼容 */
  transform: translate(-50%, 120%);
}

/* 标题切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.app-main {
  position: relative;
  z-index: 1;
  height: calc(100vh - 60px); /* 调整主区域高度，减少头部占比 */
  overflow-y: auto;
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.app-main::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.tabbar {
  position: fixed;
  left: 50%;
  bottom: calc(14px + env(safe-area-inset-bottom));
  z-index: 50;
  width: min(calc(100% - 28px), 452px);
  height: 76px;
  transform: translateX(-50%);
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow:
    0 20px 46px rgba(15, 23, 42, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.tab-item {
  position: relative;
  min-width: 0;
  height: 60px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: #94a3b8;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;
  -webkit-tap-highlight-color: transparent;
}

.tab-item:active {
  transform: scale(0.96);
}

.tab-item.active {
  color: #2563eb;
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.98), rgba(209, 250, 229, 0.82));
  box-shadow:
    0 12px 24px rgba(59, 130, 246, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.tab-icon {
  font-size: 21px;
  line-height: 1;
  transition: transform 0.22s ease;
}

.tab-item.active .tab-icon {
  transform: translateY(-1px) scale(1.08);
}

.tab-label {
  font-size: 11px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.01em;
}

@media (min-width: 768px) {
  .app-shell {
    padding: 24px 0;
  }

  .phone-frame {
    min-height: calc(100vh - 48px);
    max-height: 920px;
    border-radius: 42px;
  }

  .app-header {
    border-top-left-radius: 42px;
    border-top-right-radius: 42px;
  }

  .tabbar {
    bottom: 38px;
  }
}

@media (max-width: 360px) {
  .app-header {
    padding-left: 14px;
    padding-right: 14px;
  }

  .brand-icon {
    width: 38px;
    height: 38px;
    border-radius: 16px;
  }

  .brand-copy h1 {
    font-size: 16px;
  }

  .header-status {
    padding: 0 9px;
  }

  .tabbar {
    width: min(calc(100% - 20px), 452px);
  }
}
</style>
