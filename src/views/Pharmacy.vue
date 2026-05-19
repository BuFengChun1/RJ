<script setup lang="ts">
/**
 * 页面名称：附近药店 (Pharmacy Finder)
 * 相对地址：src/views/Pharmacy.vue
 * 功能概括：辅助功能页面。根据当前地理位置（模拟）展示周边药店信息，支持名称/地址搜索、营业时间查看及一键拨号咨询。
 */
import { ref, computed } from 'vue'

interface Pharmacy {
  id: number
  name: string
  dist: string
  addr: string
  hours: string
  phone: string
  rating: number
  status: 'open' | 'soon' | 'closed'
  services: string[]
}

const keyword = ref<string>('')

const pharmacies = ref<Pharmacy[]>([
  {
    id: 1,
    name: '老百姓大药房',
    dist: '500m',
    addr: '幸福路 128 号 · 近社区卫生服务站',
    hours: '08:00-22:00',
    phone: '021-12345678',
    rating: 4.8,
    status: 'open',
    services: ['医保', '慢病药', '夜间咨询'],
  },
  {
    id: 2,
    name: '益丰大药房',
    dist: '800m',
    addr: '安康路 256 号 · 银杏广场旁',
    hours: '07:30-23:00',
    phone: '021-87654321',
    rating: 4.6,
    status: 'open',
    services: ['24h 咨询', '儿童用药', '血压测量'],
  },
  {
    id: 3,
    name: '国大药房',
    dist: '1.2km',
    addr: '长寿路 399 号 · 地铁口向东 100 米',
    hours: '09:00-21:00',
    phone: '021-56781234',
    rating: 4.5,
    status: 'soon',
    services: ['医保', '中成药', '处方药咨询'],
  },
  {
    id: 4,
    name: '海王星辰',
    dist: '1.5km',
    addr: '健康大道 500 号 · 家庭健康中心一层',
    hours: '08:30-22:30',
    phone: '021-43218765',
    rating: 4.3,
    status: 'closed',
    services: ['家庭常备药', '保健品', '线上购药'],
  },
])

const filteredPharmacies = computed<Pharmacy[]>(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return pharmacies.value

  return pharmacies.value.filter(
    (p) =>
      p.name.toLowerCase().includes(kw) ||
      p.addr.toLowerCase().includes(kw) ||
      p.services.some((service) => service.toLowerCase().includes(kw))
  )
})

const openPharmaciesCount = computed(() =>
  pharmacies.value.filter((item) => item.status === 'open').length
)

const nearestPharmacy = computed(() => pharmacies.value[0])

const getStatusText = (status: Pharmacy['status']) => {
  if (status === 'open') return '营业中'
  if (status === 'soon') return '即将关门'
  return '已打烊'
}

const getStatusHint = (status: Pharmacy['status']) => {
  if (status === 'open') return '现在可电话咨询'
  if (status === 'soon') return '建议先电话确认'
  return '可查看明日营业时间'
}

const dial = (phone: string): void => {
  window.location.href = `tel:${phone}`
}

const navigateTo = (pharmacy: Pharmacy): void => {
  const query = encodeURIComponent(pharmacy.addr)
  window.location.href = `https://maps.apple.com/?q=${query}`
}

const clearSearch = () => {
  keyword.value = ''
}
</script>

<template>
  <div class="pharmacy-page">
    <div class="ambient ambient-blue"></div>
    <div class="ambient ambient-green"></div>

    <header class="page-header">
      <div>
        <p class="eyebrow">Pharmacy Locator</p>
        <h2>附近药店</h2>
        <p class="header-desc">查找周边药店，快速拨号咨询常用药品。</p>
      </div>

      <button class="location-button" type="button" aria-label="当前位置">
        <span>⌖</span>
      </button>
    </header>

    <main class="content">
      <section class="location-card">
        <div class="location-info">
          <div class="location-icon">📍</div>
          <div>
            <p>当前位置</p>
            <h3>幸福社区附近</h3>
            <span>已为你模拟搜索 2km 内可用药店</span>
          </div>
        </div>

        <div class="location-stats">
          <div>
            <strong>{{ pharmacies.length }}</strong>
            <span>附近药店</span>
          </div>
          <div>
            <strong>{{ openPharmaciesCount }}</strong>
            <span>营业中</span>
          </div>
          <div>
            <strong>{{ nearestPharmacy.dist }}</strong>
            <span>最近距离</span>
          </div>
        </div>
      </section>

      <section class="search-section">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="keyword"
            type="search"
            placeholder="搜索药店名称、地址或服务..."
          />
          <button v-if="keyword" type="button" @click="clearSearch">×</button>
        </div>
      </section>

      <section class="map-card" aria-label="附近药店地图">
        <div class="map-grid"></div>
        <div class="map-pin main-pin">
          <span>你</span>
        </div>
        <div class="map-pin pin-one">💊</div>
        <div class="map-pin pin-two">🏪</div>
        <div class="map-pin pin-three">✚</div>

        <div class="map-info">
          <p>模拟地图视图</p>
          <h3>附近 {{ pharmacies.length }} 家药店</h3>
          <span>接入地图 API 后可展示真实路线与导航</span>
        </div>
      </section>

      <section class="section-header">
        <div>
          <p>Nearby Pharmacies</p>
          <h3>推荐药店</h3>
        </div>
        <span>{{ filteredPharmacies.length }} 家</span>
      </section>

      <section v-if="filteredPharmacies.length === 0" class="empty-state">
        <div class="empty-icon">🍃</div>
        <h3>没有找到相关药店</h3>
        <p>可以换个关键词，比如“医保”“儿童用药”或附近道路名称。</p>
        <button type="button" @click="clearSearch">查看全部药店</button>
      </section>

      <section v-else class="pharmacy-list">
        <article
          v-for="p in filteredPharmacies"
          :key="p.id"
          class="pharmacy-card"
          :class="p.status"
        >
          <div class="card-top">
            <div class="store-icon">
              <span>🏪</span>
            </div>

            <div class="store-main">
              <div class="title-row">
                <h3>{{ p.name }}</h3>
                <span class="distance-pill">{{ p.dist }}</span>
              </div>

              <div class="meta-row">
                <span class="rating">★ {{ p.rating }}</span>
                <span class="status-pill" :class="p.status">
                  {{ getStatusText(p.status) }}
                </span>
              </div>
            </div>
          </div>

          <div class="info-box">
            <div class="info-line">
              <span>📍</span>
              <p>{{ p.addr }}</p>
            </div>

            <div class="info-line">
              <span>🕘</span>
              <p>营业时间：{{ p.hours }} · {{ getStatusHint(p.status) }}</p>
            </div>
          </div>

          <div class="service-list">
            <span v-for="service in p.services" :key="service">
              {{ service }}
            </span>
          </div>

          <div class="card-actions">
            <button class="call-button" type="button" @click="dial(p.phone)">
              <span>📞</span>
              一键拨号
            </button>

            <button class="nav-button" type="button" @click="navigateTo(p)">
              <span>🧭</span>
              导航
            </button>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.pharmacy-page {
  position: relative;
  min-height: 100%;
  padding: 18px 18px 120px;
  overflow: hidden;
  color: #111827;
  background:
    radial-gradient(circle at 14% 6%, rgba(59, 130, 246, 0.18), transparent 30%),
    radial-gradient(circle at 90% 20%, rgba(16, 185, 129, 0.14), transparent 28%),
    linear-gradient(180deg, #f7fbff 0%, #eef8f4 52%, #f8fafc 100%);
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "SF Pro Display",
    "SF Pro Text",
    "Segoe UI",
    sans-serif;
}

.ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(36px);
  pointer-events: none;
}

.ambient-blue {
  width: 190px;
  height: 190px;
  left: -90px;
  top: 80px;
  background: rgba(96, 165, 250, 0.2);
}

.ambient-green {
  width: 220px;
  height: 220px;
  right: -100px;
  top: 280px;
  background: rgba(52, 211, 153, 0.16);
}

.page-header,
.content {
  position: relative;
  z-index: 1;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  animation: fadeUp 0.45s ease both;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #3b82f6;
  text-transform: uppercase;
}

.page-header h2 {
  margin: 0;
  font-size: 32px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.05em;
}

.header-desc {
  max-width: 270px;
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.55;
  font-weight: 600;
  color: #6b7280;
}

.location-button {
  width: 50px;
  height: 50px;
  border: 0;
  border-radius: 20px;
  display: grid;
  place-items: center;
  color: white;
  font-size: 24px;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  box-shadow: 0 14px 30px rgba(59, 130, 246, 0.24);
  transition: transform 0.22s ease;
}

.location-button:active {
  transform: scale(0.94);
}

.content {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.location-card {
  padding: 18px;
  border-radius: 32px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.62)),
    linear-gradient(135deg, rgba(219, 234, 254, 0.52), rgba(209, 250, 229, 0.44));
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: 0 18px 46px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  animation: fadeUp 0.5s ease both;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.location-icon {
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
  border-radius: 22px;
  display: grid;
  place-items: center;
  font-size: 28px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.location-info p {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 900;
  color: #3b82f6;
}

.location-info h3 {
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.location-info span {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.45;
  font-weight: 650;
  color: #6b7280;
}

.location-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-top: 16px;
}

.location-stats div {
  min-height: 68px;
  padding: 10px 6px;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.72);
}

.location-stats strong {
  font-size: 21px;
  line-height: 1;
  font-weight: 900;
}

.location-stats span {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
}

.search-section {
  animation: fadeUp 0.55s ease both;
}

.search-box {
  position: relative;
  height: 54px;
  display: flex;
  align-items: center;
  border-radius: 23px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.search-icon {
  position: absolute;
  left: 17px;
  font-size: 16px;
}

.search-box input {
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  padding: 0 48px 0 46px;
  color: #111827;
  font-size: 14px;
  font-family: inherit;
  font-weight: 650;
  background: transparent;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.search-box input:focus {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
  border-radius: 23px;
}

.search-box button {
  position: absolute;
  right: 10px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  color: #64748b;
  font-size: 22px;
  background: rgba(241, 245, 249, 0.9);
}

.map-card {
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 34px;
  background:
    linear-gradient(135deg, rgba(219, 234, 254, 0.75), rgba(209, 250, 229, 0.65)),
    #eef8f4;
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.86),
    0 18px 42px rgba(15, 23, 42, 0.08);
  animation: fadeUp 0.6s ease both;
}

.map-grid {
  position: absolute;
  inset: -20px;
  opacity: 0.42;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.8) 1px, transparent 1px);
  background-size: 34px 34px;
  transform: rotate(-8deg);
}

.map-card::before,
.map-card::after {
  content: "";
  position: absolute;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.58);
}

.map-card::before {
  width: 220px;
  height: 36px;
  left: -24px;
  top: 70px;
  transform: rotate(18deg);
}

.map-card::after {
  width: 260px;
  height: 34px;
  right: -70px;
  bottom: 40px;
  transform: rotate(-22deg);
}

.map-pin {
  position: absolute;
  z-index: 2;
  width: 38px;
  height: 38px;
  border-radius: 17px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
}

.main-pin {
  left: 28px;
  top: 28px;
  color: white;
  font-size: 12px;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6, #10b981);
}

.pin-one {
  right: 70px;
  top: 35px;
}

.pin-two {
  left: 126px;
  bottom: 42px;
}

.pin-three {
  right: 32px;
  bottom: 42px;
}

.map-info {
  position: absolute;
  z-index: 3;
  left: 16px;
  right: 16px;
  bottom: 14px;
  padding: 12px 14px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.map-info p {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 900;
  color: #3b82f6;
  text-transform: uppercase;
}

.map-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
}

.map-info span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  font-weight: 650;
  color: #64748b;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  animation: fadeUp 0.62s ease both;
}

.section-header p {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #60a5fa;
  text-transform: uppercase;
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.section-header > span {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
  background: rgba(219, 234, 254, 0.72);
}

.pharmacy-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.pharmacy-card {
  padding: 15px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    opacity 0.22s ease;
  animation: fadeUp 0.65s ease both;
}

.pharmacy-card:active {
  transform: scale(0.985);
}

.pharmacy-card.closed {
  opacity: 0.72;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 13px;
}

.store-icon {
  width: 54px;
  height: 54px;
  flex: 0 0 auto;
  border-radius: 22px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.95), rgba(209, 250, 229, 0.78));
}

.store-icon span {
  font-size: 26px;
}

.store-main {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-row h3 {
  min-width: 0;
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
  font-weight: 900;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.distance-pill {
  flex: 0 0 auto;
  padding: 5px 8px;
  border-radius: 999px;
  color: #2563eb;
  font-size: 11px;
  line-height: 1;
  font-weight: 900;
  background: rgba(219, 234, 254, 0.88);
}

.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 8px;
}

.rating,
.status-pill {
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 1;
  font-weight: 900;
}

.rating {
  color: #b45309;
  background: rgba(254, 243, 199, 0.9);
}

.status-pill.open {
  color: #047857;
  background: rgba(209, 250, 229, 0.95);
}

.status-pill.soon {
  color: #c2410c;
  background: rgba(255, 237, 213, 0.95);
}

.status-pill.closed {
  color: #64748b;
  background: rgba(226, 232, 240, 0.86);
}

.info-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 13px;
  padding: 12px;
  border-radius: 20px;
  background: rgba(248, 250, 252, 0.82);
  border: 1px solid rgba(241, 245, 249, 0.9);
}

.info-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.info-line span {
  flex: 0 0 auto;
  font-size: 13px;
}

.info-line p {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  font-weight: 650;
  color: #475569;
}

.service-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
}

.service-list span {
  padding: 6px 9px;
  border-radius: 999px;
  color: #475569;
  font-size: 11px;
  line-height: 1;
  font-weight: 850;
  background: rgba(241, 245, 249, 0.86);
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.call-button,
.nav-button {
  min-height: 44px;
  flex: 1;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 900;
  transition: transform 0.22s ease;
}

.call-button {
  color: white;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  box-shadow: 0 12px 26px rgba(59, 130, 246, 0.22);
}

.nav-button {
  color: #2563eb;
  background: rgba(219, 234, 254, 0.86);
}

.call-button:active,
.nav-button:active {
  transform: scale(0.96);
}

.empty-state {
  padding: 34px 22px;
  border-radius: 32px;
  text-align: center;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
}

.empty-icon {
  width: 66px;
  height: 66px;
  margin: 0 auto 14px;
  border-radius: 26px;
  display: grid;
  place-items: center;
  font-size: 32px;
  background: rgba(236, 253, 245, 0.9);
}

.empty-state h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
}

.empty-state p {
  margin: 8px 0 18px;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 650;
  color: #6b7280;
}

.empty-state button {
  min-height: 46px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  color: white;
  font-size: 14px;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  box-shadow: 0 12px 26px rgba(59, 130, 246, 0.22);
}

button {
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 360px) {
  .pharmacy-page {
    padding-left: 14px;
    padding-right: 14px;
  }

  .page-header h2 {
    font-size: 28px;
  }

  .location-stats {
    gap: 7px;
  }

  .card-actions {
    flex-direction: column;
  }

  .map-card {
    height: 190px;
  }
}
</style>