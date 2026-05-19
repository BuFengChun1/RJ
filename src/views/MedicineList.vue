<script setup lang="ts">
/**
 * 页面名称：药品管理 (Medicine Management)
 * 相对地址：src/views/MedicineList.vue
 * 功能概括：家庭药箱管理核心页面。提供药品录入、清单展示、过期状态自动计算（倒计时/过期提醒）及药品删除功能。
 */
import { ref, computed, watch, inject } from 'vue'

interface Medicine {
  id: number
  name: string
  member: string
  exp: string
  dose: string
  note: string
  type: string
}

type DraftMedicine = Omit<Medicine, 'id'>
type ExpiryStatus = 'expired' | 'warning' | 'normal'

const showForm = ref<boolean>(false)
const showConfirm = ref<boolean>(false)

// 注入 App.vue 提供的全局方法，表单出现时隐藏 tabbar 避免遮挡输入法
const setTabbarHidden = inject<(hidden: boolean) => void>('setTabbarHidden')
watch(showForm, (val) => {
  if (setTabbarHidden) setTabbarHidden(val)
})

const delTarget = ref<Medicine | null>(null)
const activeFilter = ref<'all' | 'normal' | 'warning' | 'expired'>('all')

const medicines = ref<Medicine[]>([
  {
    id: 1,
    name: '阿莫西林胶囊',
    member: '爸爸',
    exp: '2026-06-15',
    dose: '每日 3 次，每次 1 粒',
    note: '饭后半小时服用，避免空腹',
    type: '抗生素',
  },
  {
    id: 2,
    name: '布洛芬缓释胶囊',
    member: '妈妈',
    exp: '2026-03-20',
    dose: '每日 2 次，每次 1 粒',
    note: '发烧或头痛时服用',
    type: '止痛退热',
  },
  {
    id: 3,
    name: '复合维生素 C',
    member: '孩子',
    exp: '2027-01-10',
    dose: '每日 1 次，每次 1 粒',
    note: '早晚均可，建议随餐',
    type: '营养补充',
  },
  {
    id: 4,
    name: '蒙脱石散',
    member: '全家',
    exp: '2026-05-30',
    dose: '按说明书冲服',
    note: '儿童使用前需确认剂量',
    type: '肠胃用药',
  },
])

const initFormState = (): DraftMedicine => ({
  name: '',
  member: '',
  exp: '',
  dose: '',
  note: '',
  type: '',
})

const form = ref<DraftMedicine>(initFormState())

const daysLeft = (exp: string): number => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expDate = new Date(exp)
  expDate.setHours(0, 0, 0, 0)

  return Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

const getExpStatus = (exp: string): ExpiryStatus => {
  const d = daysLeft(exp)
  if (d < 0) return 'expired'
  if (d <= 30) return 'warning'
  return 'normal'
}

const getExpLabel = (exp: string): string => {
  const d = daysLeft(exp)
  if (d < 0) return `已过期 ${Math.abs(d)} 天`
  if (d === 0) return '今天到期'
  if (d <= 30) return `仅剩 ${d} 天到期`
  return `有效期至 ${exp}`
}

const getStatusText = (exp: string): string => {
  const status = getExpStatus(exp)
  if (status === 'expired') return '已过期'
  if (status === 'warning') return '临期'
  return '正常'
}

const normalCount = computed(() =>
  medicines.value.filter((m) => getExpStatus(m.exp) === 'normal').length
)

const warningCount = computed(() =>
  medicines.value.filter((m) => getExpStatus(m.exp) === 'warning').length
)

const expiredCount = computed(() =>
  medicines.value.filter((m) => getExpStatus(m.exp) === 'expired').length
)

const expWarnings = computed<Medicine[]>(() =>
  medicines.value.filter((m) => getExpStatus(m.exp) !== 'normal')
)

const filteredMedicines = computed(() => {
  if (activeFilter.value === 'all') return medicines.value
  return medicines.value.filter((m) => getExpStatus(m.exp) === activeFilter.value)
})

const healthTip = computed(() => {
  if (expiredCount.value > 0) return `有 ${expiredCount.value} 款药品已过期，建议尽快清理。`
  if (warningCount.value > 0) return `有 ${warningCount.value} 款药品即将到期，记得检查药箱。`
  return '家庭药箱状态良好，继续保持定期整理。'
})

const filters = computed(() => [
  { key: 'all' as const, label: '全部', count: medicines.value.length },
  { key: 'normal' as const, label: '正常', count: normalCount.value },
  { key: 'warning' as const, label: '临期', count: warningCount.value },
  { key: 'expired' as const, label: '过期', count: expiredCount.value },
])

const openForm = () => {
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  form.value = initFormState()
}

const addMedicine = (): void => {
  if (!form.value.name.trim() || !form.value.member.trim()) return

  medicines.value.unshift({
    id: Date.now(),
    name: form.value.name,
    member: form.value.member,
    exp: form.value.exp || '2027-12-31',
    dose: form.value.dose || '请按说明书服用',
    note: form.value.note || '暂无特殊备注',
    type: form.value.type || '家庭常备',
  })

  closeForm()
}

const requestDelete = (med: Medicine): void => {
  delTarget.value = med
  showConfirm.value = true
}

const confirmDelete = (): void => {
  if (!delTarget.value) return
  medicines.value = medicines.value.filter((m) => m.id !== delTarget.value!.id)
  showConfirm.value = false
  delTarget.value = null
}

const cancelDelete = (): void => {
  showConfirm.value = false
  delTarget.value = null
}
</script>

<template>
  <div class="medicine-page">
    <div class="ambient ambient-blue"></div>
    <div class="ambient ambient-green"></div>

    <header class="page-header">
      <div>
        <p class="eyebrow">Medicine Cabinet</p>
        <h2>家庭药箱</h2>
        <p class="header-desc">集中管理家人的药品、剂量与有效期。</p>
      </div>

      <button class="add-top-button" type="button" @click="openForm" aria-label="添加药品">
        ＋
      </button>
    </header>

    <main class="content">
      <section class="summary-card">
        <div class="summary-top">
          <div>
            <p>药箱状态</p>
            <h3>{{ medicines.length }} 款药品</h3>
          </div>

          <div class="cabinet-icon">💊</div>
        </div>

        <p class="summary-tip">{{ healthTip }}</p>

        <div class="summary-grid">
          <div class="summary-item">
            <strong>{{ normalCount }}</strong>
            <span>正常</span>
          </div>
          <div class="summary-item warning">
            <strong>{{ warningCount }}</strong>
            <span>临期</span>
          </div>
          <div class="summary-item danger">
            <strong>{{ expiredCount }}</strong>
            <span>过期</span>
          </div>
        </div>
      </section>

      <section v-if="expWarnings.length" class="alert-card">
        <div class="alert-icon">⚠️</div>
        <div>
          <h3>有效期提醒</h3>
          <p>
            {{ expWarnings.map((m) => m.name).join('、') }}
            需要尽快检查，避免家人误服。
          </p>
        </div>
      </section>

      <section class="filter-section">
        <button
          v-for="item in filters"
          :key="item.key"
          class="filter-chip"
          :class="{ active: activeFilter === item.key }"
          type="button"
          @click="activeFilter = item.key"
        >
          <span>{{ item.label }}</span>
          <strong>{{ item.count }}</strong>
        </button>
      </section>

      <section v-if="filteredMedicines.length === 0" class="empty-state">
        <div class="empty-icon">🪴</div>
        <h3>这里还没有药品</h3>
        <p>添加一款常用药，帮家人把有效期和用法记录下来。</p>
        <button type="button" @click="openForm">录入首个药品</button>
      </section>

      <section v-else class="medicine-list">
        <article
          v-for="m in filteredMedicines"
          :key="m.id"
          class="medicine-card"
          :class="getExpStatus(m.exp)"
        >
          <div class="medicine-icon">
            <span>💊</span>
          </div>

          <div class="medicine-info">
            <div class="card-head">
              <div class="title-area">
                <h3>{{ m.name }}</h3>
                <p>{{ m.type }} · {{ m.member }}</p>
              </div>

              <span class="status-pill" :class="getExpStatus(m.exp)">
                {{ getStatusText(m.exp) }}
              </span>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <span>👤 使用者</span>
                <strong>{{ m.member }}</strong>
              </div>
              <div class="info-item">
                <span>⏳ 有效期</span>
                <strong>{{ getExpLabel(m.exp) }}</strong>
              </div>
            </div>

            <div class="dose-box">
              <span>剂量</span>
              <p>{{ m.dose }}</p>
            </div>

            <div v-if="m.note" class="note-box">
              <span>📝</span>
              <p>{{ m.note }}</p>
            </div>

            <div class="card-actions">
              <button class="soft-button" type="button">查看详情</button>
              <button class="delete-button" type="button" @click="requestDelete(m)">
                移出药箱
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>

    <button class="fab" type="button" @click="openForm" aria-label="添加药品">
      <span>＋</span>
    </button>

    <transition name="fade">
      <div v-if="showForm" class="sheet-mask" @click.self="closeForm">
        <section class="bottom-sheet">
          <div class="sheet-handle"></div>

          <div class="sheet-header">
            <div>
              <p>New Medicine</p>
              <h3>录入药品信息</h3>
            </div>
            <button type="button" @click="closeForm">×</button>
          </div>

          <div class="form-grid">
            <label class="field full">
              <span>药品名称 *</span>
              <input v-model="form.name" type="text" placeholder="例如：阿莫西林胶囊" />
            </label>

            <label class="field">
              <span>使用成员 *</span>
              <input v-model="form.member" type="text" placeholder="例如：妈妈" />
            </label>

            <label class="field">
              <span>药品分类</span>
              <input v-model="form.type" type="text" placeholder="例如：退热药" />
            </label>

            <label class="field full">
              <span>有效期</span>
              <input v-model="form.exp" type="date" />
            </label>

            <label class="field full">
              <span>服用剂量</span>
              <input v-model="form.dose" type="text" placeholder="例如：每日 2 次，每次 1 粒" />
            </label>

            <label class="field full">
              <span>特殊备注</span>
              <textarea v-model="form.note" rows="3" placeholder="例如：饭后服用，儿童需减量"></textarea>
            </label>
          </div>

          <div class="sheet-actions">
            <button class="cancel-sheet" type="button" @click="closeForm">取消</button>
            <button
              class="save-sheet"
              type="button"
              :disabled="!form.name.trim() || !form.member.trim()"
              @click="addMedicine"
            >
              保存药品
            </button>
          </div>
        </section>
      </div>
    </transition>

    <transition name="fade">
      <dialog v-if="showConfirm" class="confirm-mask" open>
        <div class="confirm-card">
          <div class="confirm-icon">🗑️</div>
          <h3>确认移出药箱？</h3>
          <p>
            确定要将
            <strong>“{{ delTarget?.name }}”</strong>
            移出家庭药箱吗？移出后需要重新录入。
          </p>

          <div class="confirm-actions">
            <button class="cancel-button" type="button" @click="cancelDelete">
              我再想想
            </button>
            <button class="danger-button" type="button" @click="confirmDelete">
              确认移出
            </button>
          </div>
        </div>
      </dialog>
    </transition>
  </div>
</template>

<style scoped>
.medicine-page {
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
.content,
.fab {
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
  max-width: 260px;
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.55;
  font-weight: 600;
  color: #6b7280;
}

.add-top-button {
  width: 50px;
  height: 50px;
  border: 0;
  border-radius: 20px;
  color: white;
  font-size: 28px;
  line-height: 1;
  font-weight: 400;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  box-shadow: 0 14px 30px rgba(59, 130, 246, 0.24);
  transition: transform 0.22s ease;
}

.add-top-button:active {
  transform: scale(0.94);
}

.content {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.summary-card {
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

.summary-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.summary-top p {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 900;
  color: #3b82f6;
}

.summary-top h3 {
  margin: 0;
  font-size: 26px;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.cabinet-icon {
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

.summary-tip {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.55;
  font-weight: 650;
  color: #6b7280;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-top: 16px;
}

.summary-item {
  min-height: 68px;
  padding: 10px 6px;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(240, 253, 244, 0.78);
  border: 1px solid rgba(187, 247, 208, 0.7);
}

.summary-item.warning {
  background: rgba(255, 247, 237, 0.86);
  border-color: rgba(253, 186, 116, 0.45);
}

.summary-item.danger {
  background: rgba(255, 241, 242, 0.86);
  border-color: rgba(254, 205, 211, 0.6);
}

.summary-item strong {
  font-size: 22px;
  line-height: 1;
  font-weight: 900;
}

.summary-item span {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
}

.alert-card {
  padding: 15px;
  border-radius: 28px;
  display: flex;
  align-items: flex-start;
  gap: 13px;
  background: linear-gradient(135deg, rgba(255, 247, 237, 0.96), rgba(255, 255, 255, 0.72));
  border: 1px solid rgba(253, 186, 116, 0.42);
  box-shadow: 0 16px 36px rgba(245, 158, 11, 0.12);
  animation: fadeUp 0.55s ease both;
}

.alert-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: 22px;
  background: rgba(255, 237, 213, 0.96);
}

.alert-card h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  color: #9a3412;
}

.alert-card p {
  margin: 5px 0 0;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 650;
  color: #9a3412;
}

.filter-section {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 1px 4px;
  scrollbar-width: none;
}

.filter-section::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  min-height: 40px;
  padding: 0 13px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex: 0 0 auto;
  color: #64748b;
  background: rgba(255, 255, 255, 0.64);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
  transition: all 0.22s ease;
}

.filter-chip span {
  font-size: 13px;
  font-weight: 800;
}

.filter-chip strong {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #64748b;
  font-size: 11px;
  background: rgba(241, 245, 249, 0.9);
}

.filter-chip.active {
  color: #2563eb;
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.95), rgba(209, 250, 229, 0.78));
  box-shadow: 0 10px 22px rgba(59, 130, 246, 0.12);
}

.medicine-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.medicine-card {
  padding: 15px;
  border-radius: 30px;
  display: flex;
  gap: 13px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
  animation: fadeUp 0.58s ease both;
}

.medicine-card:active {
  transform: scale(0.985);
}

.medicine-card.expired {
  opacity: 0.72;
}

.medicine-icon {
  width: 52px;
  height: 52px;
  flex: 0 0 auto;
  border-radius: 21px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.92), rgba(209, 250, 229, 0.8));
}

.medicine-icon span {
  font-size: 25px;
}

.medicine-info {
  flex: 1;
  min-width: 0;
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.title-area {
  min-width: 0;
}

.title-area h3 {
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
  font-weight: 900;
  color: #111827;
}

.title-area p {
  margin: 4px 0 0;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.status-pill {
  flex: 0 0 auto;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 1;
  font-weight: 900;
}

.status-pill.normal {
  color: #047857;
  background: rgba(209, 250, 229, 0.92);
}

.status-pill.warning {
  color: #c2410c;
  background: rgba(255, 237, 213, 0.96);
}

.status-pill.expired {
  color: #be123c;
  background: rgba(255, 228, 230, 0.96);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 13px;
}

.info-item {
  padding: 10px 11px;
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.78);
  border: 1px solid rgba(241, 245, 249, 0.95);
}

.info-item span {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
}

.info-item strong {
  font-size: 12px;
  line-height: 1.4;
  font-weight: 850;
  color: #334155;
}

.dose-box,
.note-box {
  margin-top: 9px;
  padding: 11px 12px;
  border-radius: 18px;
  background: rgba(239, 246, 255, 0.62);
}

.dose-box span {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 900;
  color: #2563eb;
}

.dose-box p,
.note-box p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 650;
  color: #475569;
}

.note-box {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  background: rgba(248, 250, 252, 0.82);
}

.note-box span {
  flex: 0 0 auto;
}

.card-actions {
  display: flex;
  gap: 9px;
  margin-top: 12px;
}

.soft-button,
.delete-button {
  min-height: 40px;
  flex: 1;
  border: 0;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  transition: transform 0.22s ease;
}

.soft-button:active,
.delete-button:active {
  transform: scale(0.96);
}

.soft-button {
  color: #2563eb;
  background: rgba(219, 234, 254, 0.82);
}

.delete-button {
  color: #be123c;
  background: rgba(255, 228, 230, 0.82);
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

.empty-state button,
.save-sheet {
  min-height: 46px;
  border: 0;
  border-radius: 999px;
  color: white;
  font-size: 14px;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  box-shadow: 0 12px 26px rgba(59, 130, 246, 0.22);
}

.fab {
  position: fixed;
  right: max(20px, calc((100vw - 480px) / 2 + 20px));
  bottom: calc(96px + env(safe-area-inset-bottom));
  width: 58px;
  height: 58px;
  border: 0;
  border-radius: 23px;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  box-shadow: 0 18px 36px rgba(59, 130, 246, 0.3);
  transition: transform 0.22s ease;
}

.fab span {
  font-size: 30px;
  line-height: 1;
}

.fab:active {
  transform: scale(0.94);
}

.sheet-mask,
.confirm-mask {
  position: fixed;
  inset: 0;
  z-index: 60;
  margin: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: rgba(15, 23, 42, 0.36);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.sheet-mask {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bottom-sheet {
  width: min(100%, 480px);
  max-height: 90vh;
  overflow-y: auto;
  padding: 10px 18px calc(18px + env(safe-area-inset-bottom));
  border-radius: 34px 34px 0 0;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 -20px 60px rgba(15, 23, 42, 0.2);
  animation: slideUp 0.26s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.sheet-handle {
  width: 42px;
  height: 5px;
  margin: 0 auto 16px;
  border-radius: 999px;
  background: #cbd5e1;
}

.sheet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sheet-header p {
  margin: 0 0 5px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #3b82f6;
  text-transform: uppercase;
}

.sheet-header h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.sheet-header button {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  color: #64748b;
  font-size: 24px;
  background: #f1f5f9;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field.full {
  grid-column: span 2;
}

.field span {
  padding-left: 4px;
  font-size: 12px;
  font-weight: 900;
  color: #475569;
}

.field input,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(226, 232, 240, 0.95);
  outline: none;
  border-radius: 18px;
  padding: 0 14px;
  color: #111827;
  font-size: 14px;
  font-family: inherit;
  background: #f8fafc;
  transition:
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.field input {
  height: 48px;
}

.field textarea {
  resize: none;
  padding-top: 12px;
}

.field input:focus,
.field textarea:focus {
  border-color: rgba(59, 130, 246, 0.7);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
}

.sheet-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.cancel-sheet {
  min-height: 46px;
  flex: 0.9;
  border: 0;
  border-radius: 999px;
  color: #475569;
  font-size: 14px;
  font-weight: 900;
  background: #f1f5f9;
}

.save-sheet {
  flex: 1.1;
}

.save-sheet:disabled {
  opacity: 0.45;
  box-shadow: none;
}

.confirm-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.confirm-card {
  width: min(100%, 360px);
  padding: 24px;
  border-radius: 34px;
  text-align: center;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
  animation: popIn 0.24s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.confirm-icon {
  width: 66px;
  height: 66px;
  margin: 0 auto 14px;
  border-radius: 26px;
  display: grid;
  place-items: center;
  font-size: 32px;
  background: rgba(255, 228, 230, 0.9);
}

.confirm-card h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
}

.confirm-card p {
  margin: 10px 0 22px;
  font-size: 14px;
  line-height: 1.55;
  font-weight: 600;
  color: #64748b;
}

.confirm-card strong {
  color: #111827;
}

.confirm-actions {
  display: flex;
  gap: 10px;
}

.cancel-button,
.danger-button {
  min-height: 46px;
  flex: 1;
  border: 0;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 900;
}

.cancel-button {
  color: #475569;
  background: #f1f5f9;
}

.danger-button {
  color: white;
  background: linear-gradient(135deg, #fb7185, #ef4444);
  box-shadow: 0 12px 26px rgba(239, 68, 68, 0.2);
}

button {
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

@keyframes slideUp {
  from {
    transform: translateY(24px);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.94);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 360px) {
  .medicine-page {
    padding-left: 14px;
    padding-right: 14px;
  }

  .page-header h2 {
    font-size: 28px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .field.full {
    grid-column: span 1;
  }

  .card-actions {
    flex-direction: column;
  }
}
</style>