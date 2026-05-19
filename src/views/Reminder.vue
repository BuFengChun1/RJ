<script setup lang="ts">
/**
 * 页面名称：用药提醒 (Pill Reminder)
 * 相对地址：src/views/Reminder.vue
 * 功能概括：设置和管理服药时间。支持添加提醒任务、开关提醒开关以及服药记录打卡，确保家人按时用药。
 */
import { ref, computed } from 'vue'

interface Reminder {
  id: number
  name: string
  member: string
  time: string
  note: string
  active: boolean
  taken: boolean
}

type DraftReminder = Pick<Reminder, 'name' | 'member' | 'time' | 'note'>

interface ReminderGroup {
  key: string
  title: string
  icon: string
  desc: string
  items: Reminder[]
}

const initFormState = (): DraftReminder => ({
  name: '',
  member: '',
  time: '',
  note: '',
})

const showForm = ref<boolean>(false)
const form = ref<DraftReminder>(initFormState())

const reminders = ref<Reminder[]>([
  {
    id: 1,
    name: '阿莫西林胶囊',
    member: '爸爸',
    time: '08:00',
    note: '每日 3 次，饭后半小时服用',
    active: true,
    taken: false,
  },
  {
    id: 2,
    name: '复合维生素 C',
    member: '孩子',
    time: '09:00',
    note: '每日 1 次，增强抵抗力',
    active: true,
    taken: true,
  },
  {
    id: 3,
    name: '维生素 D 滴剂',
    member: '小宝',
    time: '12:30',
    note: '随餐服用，滴入温水即可',
    active: true,
    taken: false,
  },
  {
    id: 4,
    name: '布洛芬缓释胶囊',
    member: '妈妈',
    time: '20:00',
    note: '发烧或头痛时服用，请勿空腹',
    active: false,
    taken: false,
  },
])

const sortedReminders = computed<Reminder[]>(() =>
  [...reminders.value].sort((a, b) => a.time.localeCompare(b.time))
)

const activeCount = computed(() => reminders.value.filter((item) => item.active).length)
const takenCount = computed(() => reminders.value.filter((item) => item.taken).length)
const pendingCount = computed(() =>
  reminders.value.filter((item) => item.active && !item.taken).length
)

const progressPercent = computed(() => {
  if (!reminders.value.length) return 0
  return Math.round((takenCount.value / reminders.value.length) * 100)
})

const progressText = computed(() => {
  if (!reminders.value.length) return '还没有提醒，添加一条用药计划吧。'
  if (pendingCount.value === 0) return '今天的用药都已完成，继续保持。'
  return `今天还有 ${pendingCount.value} 次用药待完成，记得按时服药。`
})

const getPeriod = (time: string): 'morning' | 'noon' | 'evening' => {
  const hour = Number(time.split(':')[0])
  if (hour < 12) return 'morning'
  if (hour < 18) return 'noon'
  return 'evening'
}

const reminderGroups = computed<ReminderGroup[]>(() => {
  const groups: ReminderGroup[] = [
    {
      key: 'morning',
      title: '上午',
      icon: '☀️',
      desc: '开启一天前，别忘了按时服药',
      items: [],
    },
    {
      key: 'noon',
      title: '下午',
      icon: '🌤️',
      desc: '午后用药计划，照顾好自己',
      items: [],
    },
    {
      key: 'evening',
      title: '晚上',
      icon: '🌙',
      desc: '睡前检查一下今日用药',
      items: [],
    },
  ]

  sortedReminders.value.forEach((item) => {
    const period = getPeriod(item.time)
    const target = groups.find((group) => group.key === period)
    if (target) target.items.push(item)
  })

  return groups.filter((group) => group.items.length > 0)
})

const toggleReminder = (id: number): void => {
  const r = reminders.value.find((item) => item.id === id)
  if (r) r.active = !r.active
}

const markTaken = (id: number): void => {
  const r = reminders.value.find((item) => item.id === id)
  if (r && r.active) r.taken = !r.taken
}

const addReminder = (): void => {
  const { name, time } = form.value
  if (!name.trim() || !time) return

  reminders.value.push({
    id: Date.now(),
    name: form.value.name,
    member: form.value.member || '家人',
    time: form.value.time,
    note: form.value.note || '请按说明书或医嘱服用',
    active: true,
    taken: false,
  })

  form.value = initFormState()
  showForm.value = false
}

const removeReminder = (id: number): void => {
  reminders.value = reminders.value.filter((item) => item.id !== id)
}

const openForm = () => {
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  form.value = initFormState()
}
</script>

<template>
  <div class="reminder-page">
    <div class="ambient ambient-blue"></div>
    <div class="ambient ambient-green"></div>

    <header class="page-header">
      <div>
        <p class="eyebrow">Medication Reminder</p>
        <h2>用药提醒</h2>
        <p class="header-desc">为家人安排服药时间，减少漏服和重复服药。</p>
      </div>

      <button class="add-top-button" type="button" @click="openForm" aria-label="新建提醒">
        ＋
      </button>
    </header>

    <main class="content">
      <section class="summary-card">
        <div class="summary-main">
          <div class="progress-ring">
            <span>{{ progressPercent }}%</span>
          </div>

          <div class="summary-copy">
            <p>今日服药进度</p>
            <h3>{{ takenCount }} / {{ reminders.length }} 已完成</h3>
            <span>{{ progressText }}</span>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-item">
            <strong>{{ pendingCount }}</strong>
            <span>待服用</span>
          </div>
          <div class="summary-item success">
            <strong>{{ takenCount }}</strong>
            <span>已打卡</span>
          </div>
          <div class="summary-item blue">
            <strong>{{ activeCount }}</strong>
            <span>提醒中</span>
          </div>
        </div>
      </section>

      <section v-if="pendingCount > 0" class="notice-card">
        <div class="notice-icon">🔔</div>
        <div>
          <h3>温馨提醒</h3>
          <p>仍有 {{ pendingCount }} 次用药待完成，建议按计划及时打卡。</p>
        </div>
      </section>

      <section v-if="sortedReminders.length === 0" class="empty-state">
        <div class="empty-icon">⏰</div>
        <h3>还未设定任何提醒</h3>
        <p>为家人添加一条用药计划，让每一次服药都更安心。</p>
        <button type="button" @click="openForm">新建第一个提醒</button>
      </section>

      <section v-else class="group-list">
        <section v-for="group in reminderGroups" :key="group.key" class="time-group">
          <div class="group-header">
            <div>
              <p>{{ group.desc }}</p>
              <h3>{{ group.icon }} {{ group.title }}</h3>
            </div>
            <span>{{ group.items.length }} 项</span>
          </div>

          <article
            v-for="r in group.items"
            :key="r.id"
            class="reminder-card"
            :class="[
              r.taken ? 'taken' : '',
              !r.active ? 'inactive' : '',
            ]"
          >
            <div class="time-box">
              <strong>{{ r.time }}</strong>
              <span>{{ r.active ? '提醒中' : '已关闭' }}</span>
            </div>

            <div class="card-body">
              <div class="card-head">
                <div class="title-area">
                  <h4>{{ r.name }}</h4>
                  <p>👤 {{ r.member }}</p>
                </div>

                <button
                  class="delete-button"
                  type="button"
                  aria-label="删除此提醒"
                  @click="removeReminder(r.id)"
                >
                  ×
                </button>
              </div>

              <div class="note-box">
                <span>📝</span>
                <p>{{ r.note }}</p>
              </div>

              <div class="card-actions">
                <button
                  class="taken-button"
                  :class="{ done: r.taken }"
                  type="button"
                  :disabled="!r.active"
                  @click="markTaken(r.id)"
                >
                  {{ r.taken ? '已完成打卡' : '标记已服用' }}
                </button>

                <button
                  role="switch"
                  :aria-checked="r.active"
                  class="switch-button"
                  :class="{ on: r.active }"
                  type="button"
                  @click="toggleReminder(r.id)"
                >
                  <span></span>
                </button>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>

    <button class="fab" type="button" @click="openForm" aria-label="新建提醒">
      <span>＋</span>
    </button>

    <transition name="fade">
      <div v-if="showForm" class="sheet-mask" @click.self="closeForm">
        <section class="bottom-sheet">
          <div class="sheet-handle"></div>

          <div class="sheet-header">
            <div>
              <p>New Reminder</p>
              <h3>添加用药提醒</h3>
              <span>为家人设置一个清晰的服药时间。</span>
            </div>

            <button type="button" @click="closeForm">×</button>
          </div>

          <div class="form-grid">
            <label class="field full">
              <span>药品名称 *</span>
              <input v-model="form.name" type="text" placeholder="例如：阿莫西林胶囊" />
            </label>

            <label class="field">
              <span>服用成员</span>
              <input v-model="form.member" type="text" placeholder="例如：爸爸" />
            </label>

            <label class="field">
              <span>提醒时间 *</span>
              <input v-model="form.time" type="time" />
            </label>

            <label class="field full">
              <span>用药说明</span>
              <textarea
                v-model="form.note"
                rows="3"
                placeholder="例如：每日 3 次，饭后半小时服用"
              ></textarea>
            </label>
          </div>

          <div class="sheet-actions">
            <button class="cancel-sheet" type="button" @click="closeForm">取消</button>
            <button
              class="save-sheet"
              type="button"
              :disabled="!form.name.trim() || !form.time"
              @click="addReminder"
            >
              保存提醒
            </button>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.reminder-page {
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
  max-width: 270px;
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

.summary-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-ring {
  width: 78px;
  height: 78px;
  flex: 0 0 auto;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    conic-gradient(#10b981 v-bind(progressPercent + '%'), rgba(226, 232, 240, 0.92) 0),
    #ffffff;
  box-shadow:
    inset 0 0 0 8px rgba(255, 255, 255, 0.88),
    0 12px 24px rgba(16, 185, 129, 0.18);
}

.progress-ring span {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #ffffff;
  font-size: 16px;
  font-weight: 900;
  color: #059669;
}

.summary-copy {
  min-width: 0;
}

.summary-copy p {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 900;
  color: #3b82f6;
}

.summary-copy h3 {
  margin: 0;
  font-size: 21px;
  line-height: 1.25;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.summary-copy span {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.45;
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
  background: rgba(255, 247, 237, 0.86);
  border: 1px solid rgba(253, 186, 116, 0.42);
}

.summary-item.success {
  background: rgba(236, 253, 245, 0.86);
  border-color: rgba(167, 243, 208, 0.7);
}

.summary-item.blue {
  background: rgba(239, 246, 255, 0.86);
  border-color: rgba(191, 219, 254, 0.7);
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

.notice-card {
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

.notice-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: 22px;
  background: rgba(255, 237, 213, 0.96);
}

.notice-card h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  color: #9a3412;
}

.notice-card p {
  margin: 5px 0 0;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 650;
  color: #9a3412;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.time-group {
  animation: fadeUp 0.58s ease both;
}

.group-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 11px;
}

.group-header p {
  margin: 0 0 4px;
  font-size: 11px;
  line-height: 1.35;
  font-weight: 800;
  color: #60a5fa;
}

.group-header h3 {
  margin: 0;
  font-size: 19px;
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: -0.04em;
}

.group-header > span {
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

.reminder-card {
  padding: 14px;
  margin-bottom: 12px;
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
    opacity 0.22s ease,
    background 0.22s ease;
}

.reminder-card:active {
  transform: scale(0.985);
}

.reminder-card.taken {
  background: rgba(236, 253, 245, 0.68);
}

.reminder-card.inactive {
  opacity: 0.62;
  filter: grayscale(0.12);
}

.time-box {
  width: 66px;
  height: 70px;
  flex: 0 0 auto;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(135deg, rgba(219, 234, 254, 0.95), rgba(209, 250, 229, 0.78));
}

.time-box strong {
  font-size: 18px;
  line-height: 1;
  font-weight: 900;
  color: #2563eb;
}

.time-box span {
  margin-top: 7px;
  font-size: 11px;
  line-height: 1;
  font-weight: 900;
  color: #059669;
}

.reminder-card.inactive .time-box {
  background: rgba(241, 245, 249, 0.9);
}

.reminder-card.inactive .time-box strong,
.reminder-card.inactive .time-box span {
  color: #94a3b8;
}

.card-body {
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

.title-area h4 {
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
  font-weight: 900;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reminder-card.taken .title-area h4 {
  color: #64748b;
  text-decoration: line-through;
}

.title-area p {
  margin: 5px 0 0;
  font-size: 12px;
  line-height: 1;
  font-weight: 750;
  color: #64748b;
}

.delete-button {
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 50%;
  color: #94a3b8;
  font-size: 24px;
  line-height: 1;
  background: rgba(241, 245, 249, 0.72);
  transition:
    background 0.22s ease,
    color 0.22s ease,
    transform 0.22s ease;
}

.delete-button:active {
  transform: scale(0.92);
  color: #be123c;
  background: rgba(255, 228, 230, 0.86);
}

.note-box {
  margin-top: 10px;
  padding: 10px 11px;
  border-radius: 18px;
  display: flex;
  align-items: flex-start;
  gap: 7px;
  background: rgba(248, 250, 252, 0.82);
  border: 1px solid rgba(241, 245, 249, 0.9);
}

.note-box span {
  flex: 0 0 auto;
  font-size: 13px;
}

.note-box p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 650;
  color: #475569;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.taken-button {
  min-height: 42px;
  flex: 1;
  border: 0;
  border-radius: 999px;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 900;
  background: rgba(219, 234, 254, 0.9);
  transition:
    transform 0.22s ease,
    background 0.22s ease,
    color 0.22s ease;
}

.taken-button.done {
  color: #047857;
  background: rgba(209, 250, 229, 0.96);
}

.taken-button:disabled {
  color: #94a3b8;
  background: rgba(226, 232, 240, 0.72);
}

.taken-button:active:not(:disabled) {
  transform: scale(0.97);
}

.switch-button {
  position: relative;
  width: 54px;
  height: 32px;
  flex: 0 0 auto;
  border: 0;
  border-radius: 999px;
  background: #cbd5e1;
  transition:
    background 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
}

.switch-button span {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: white;
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.2);
  transition: transform 0.22s ease;
}

.switch-button.on {
  background: linear-gradient(135deg, #3b82f6, #10b981);
  box-shadow: 0 8px 18px rgba(16, 185, 129, 0.2);
}

.switch-button.on span {
  transform: translateX(22px);
}

.switch-button:active {
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
  background: rgba(239, 246, 255, 0.9);
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

.sheet-mask {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(15, 23, 42, 0.36);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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

.sheet-header span {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  font-weight: 650;
  color: #64748b;
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

@media (max-width: 360px) {
  .reminder-page {
    padding-left: 14px;
    padding-right: 14px;
  }

  .page-header h2 {
    font-size: 28px;
  }

  .summary-main {
    align-items: flex-start;
  }

  .progress-ring {
    width: 70px;
    height: 70px;
  }

  .progress-ring span {
    width: 50px;
    height: 50px;
    font-size: 14px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .field.full {
    grid-column: span 1;
  }

  .reminder-card {
    gap: 10px;
  }

  .time-box {
    width: 58px;
  }

  .card-actions {
    flex-wrap: wrap;
  }

  .switch-button {
    width: 52px;
  }
}
</style>