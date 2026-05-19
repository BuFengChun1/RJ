<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface TabItem {
  path: string
  name: string
  icon: string
  activeIcon: string
  desc: string
}

const route = useRoute()

const tabs: TabItem[] = [
  {
    path: '/',
    name: '首页',
    icon: '⌂',
    activeIcon: '🏠',
    desc: '家庭健康概览',
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

      <header class="app-header">
        <div class="header-inner">
          <div class="brand-block">
            <div class="brand-icon">
              <span>✚</span>
            </div>

            <div class="brand-copy">
              <p class="eyebrow">Family Medicine Care</p>
              <h1>家庭药品管理</h1>
            </div>
          </div>

          <div class="header-status">
            <span class="status-dot"></span>
            <span>守护中</span>
          </div>
        </div>

        <div class="page-hint">
          <div>
            <p class="page-name">{{ currentTab.name }}</p>
            <p class="page-desc">{{ currentTab.desc }}</p>
          </div>
          <div class="page-icon">
            {{ currentTab.activeIcon }}
          </div>
        </div>
      </header>

      <main class="app-main">
        <router-view />
      </main>

      <nav class="tabbar" aria-label="底部导航">
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

.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  padding: calc(14px + env(safe-area-inset-top)) 18px 14px;
  background: rgba(255, 255, 255, 0.72);
  border-bottom: 1px solid rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: white;
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
  box-shadow: 0 12px 26px rgba(59, 130, 246, 0.24);
}

.brand-copy {
  min-width: 0;
}

.eyebrow {
  margin: 0 0 2px;
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #60a5fa;
}

.brand-copy h1 {
  margin: 0;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111827;
}

.header-status {
  height: 32px;
  padding: 0 11px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #047857;
  background: rgba(236, 253, 245, 0.9);
  border: 1px solid rgba(167, 243, 208, 0.9);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14);
}

.page-hint {
  margin-top: 14px;
  padding: 14px 14px 14px 16px;
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.58)),
    linear-gradient(135deg, rgba(219, 234, 254, 0.55), rgba(209, 250, 229, 0.45));
  border: 1px solid rgba(255, 255, 255, 0.76);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.07);
}

.page-name {
  margin: 0;
  font-size: 15px;
  line-height: 1.25;
  font-weight: 800;
  color: #111827;
}

.page-desc {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.35;
  font-weight: 600;
  color: #6b7280;
}

.page-icon {
  width: 42px;
  height: 42px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.app-main {
  position: relative;
  z-index: 1;
  height: calc(100vh - 154px);
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
  grid-template-columns: repeat(4, 1fr);
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