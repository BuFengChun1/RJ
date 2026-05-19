<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'

interface Member {
  id: number
  name: string
  relation: string
  age: string
  condition: string
  medicineCount: number
  reminderCount: number
  color: 'blue' | 'emerald' | 'rose' | 'amber'
}

type DraftMember = Omit<Member, 'id' | 'medicineCount' | 'reminderCount' | 'color'>

const setTabbarHidden = inject<(hidden: boolean) => void>('setTabbarHidden')

const showForm = ref(false)

watch(showForm, (visible) => {
  if (setTabbarHidden) setTabbarHidden(visible)
})

const members = ref<Member[]>([
  {
    id: 1,
    name: '爸爸',
    relation: '父亲',
    age: '52',
    condition: '血压偏高，需关注每日降压药服用情况',
    medicineCount: 3,
    reminderCount: 2,
    color: 'blue',
  },
  {
    id: 2,
    name: '妈妈',
    relation: '母亲',
    age: '50',
    condition: '偶尔头痛，常备止痛退热药',
    medicineCount: 2,
    reminderCount: 1,
    color: 'rose',
  },
  {
    id: 3,
    name: '孩子',
    relation: '儿童',
    age: '8',
    condition: '儿童用药需单独记录剂量',
    medicineCount: 2,
    reminderCount: 1,
    color: 'emerald',
  },
])

const initForm = (): DraftMember => ({
  name: '',
  relation: '',
  age: '',
  condition: '',
})

const form = ref<DraftMember>(initForm())

const totalMedicines = computed(() =>
  members.value.reduce((sum, item) => sum + item.medicineCount, 0)
)

const totalReminders = computed(() =>
  members.value.reduce((sum, item) => sum + item.reminderCount, 0)
)

const colorQueue: Member['color'][] = ['blue', 'emerald', 'rose', 'amber']

const openForm = () => {
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  form.value = initForm()
}

const addMember = () => {
  if (!form.value.name.trim() || !form.value.relation.trim()) return

  members.value.unshift({
    id: Date.now(),
    name: form.value.name.trim(),
    relation: form.value.relation.trim(),
    age: form.value.age.trim() || '未填写',
    condition: form.value.condition.trim() || '暂无特殊健康备注',
    medicineCount: 0,
    reminderCount: 0,
    color: colorQueue[members.value.length % colorQueue.length],
  })

  closeForm()
}

const removeMember = (id: number) => {
  members.value = members.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="members-page">
    <div class="ambient ambient-blue"></div>
    <div class="ambient ambient-green"></div>

    <header class="page-header">
      <div>
        <p class="eyebrow">Family Care</p>
        <h2>家庭成员</h2>
        <p class="header-desc">先录入家人信息，再为每位成员维护药品和提醒计划。</p>
      </div>

      <button class="add-top-button" type="button" @click="openForm" aria-label="添加家庭成员">
        +
      </button>
    </header>

    <main class="content">
      <section class="summary-card">
        <div class="summary-main">
          <div>
            <p>成员概览</p>
            <h3>{{ members.length }} 位家人</h3>
            <span>已关联 {{ totalMedicines }} 款药品，{{ totalReminders }} 条提醒</span>
          </div>
          <div class="family-icon">👨‍👩‍👧</div>
        </div>

        <div class="summary-grid">
          <div>
            <strong>{{ members.length }}</strong>
            <span>成员</span>
          </div>
          <div>
            <strong>{{ totalMedicines }}</strong>
            <span>药品</span>
          </div>
          <div>
            <strong>{{ totalReminders }}</strong>
            <span>提醒</span>
          </div>
        </div>
      </section>

      <section class="hint-card">
        <div class="hint-icon">💡</div>
        <div>
          <h3>设计说明</h3>
          <p>成员信息用于区分不同家人的药品和提醒对象，避免家庭共用药箱时发生混淆。</p>
        </div>
      </section>

      <section class="member-list">
        <article v-for="member in members" :key="member.id" class="member-card" :class="member.color">
          <div class="avatar">
            {{ member.name.slice(0, 1) }}
          </div>

          <div class="member-info">
            <div class="card-head">
              <div>
                <h3>{{ member.name }}</h3>
                <p>{{ member.relation }} · {{ member.age }} 岁</p>
              </div>
              <button type="button" class="delete-button" aria-label="删除成员" @click="removeMember(member.id)">
                ×
              </button>
            </div>

            <p class="condition">{{ member.condition }}</p>

            <div class="member-stats">
              <span>{{ member.medicineCount }} 款药品</span>
              <span>{{ member.reminderCount }} 条提醒</span>
            </div>
          </div>
        </article>
      </section>
    </main>

    <button class="fab" type="button" @click="openForm" aria-label="添加家庭成员">
      <span>+</span>
    </button>

    <transition name="fade">
      <div v-if="showForm" class="sheet-mask" @click.self="closeForm">
        <section class="bottom-sheet">
          <div class="sheet-handle"></div>

          <div class="sheet-header">
            <div>
              <p>New Member</p>
              <h3>录入家庭成员</h3>
              <span>成员信息会作为药品和提醒的归属依据。</span>
            </div>
            <button type="button" @click="closeForm">×</button>
          </div>

          <div class="form-grid">
            <label class="field">
              <span>姓名/称呼 *</span>
              <input v-model="form.name" type="text" placeholder="例如：爸爸" />
            </label>

            <label class="field">
              <span>关系 *</span>
              <input v-model="form.relation" type="text" placeholder="例如：父亲" />
            </label>

            <label class="field full">
              <span>年龄</span>
              <input v-model="form.age" type="number" min="0" placeholder="例如：52" />
            </label>

            <label class="field full">
              <span>健康备注</span>
              <textarea
                v-model="form.condition"
                rows="3"
                placeholder="例如：血压偏高，需要每日提醒服药"
              ></textarea>
            </label>
          </div>

          <div class="sheet-actions">
            <button class="cancel-sheet" type="button" @click="closeForm">取消</button>
            <button
              class="save-sheet"
              type="button"
              :disabled="!form.name.trim() || !form.relation.trim()"
              @click="addMember"
            >
              保存成员
            </button>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.members-page {
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

.add-top-button,
.fab {
  border: 0;
  color: white;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  box-shadow: 0 14px 30px rgba(59, 130, 246, 0.24);
  transition: transform 0.22s ease;
}

.add-top-button {
  width: 50px;
  height: 50px;
  border-radius: 20px;
  font-size: 28px;
  line-height: 1;
}

.add-top-button:active,
.fab:active {
  transform: scale(0.94);
}

.content {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.summary-card,
.hint-card,
.member-card {
  border: 1px solid rgba(255, 255, 255, 0.82);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.07);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.summary-card {
  padding: 18px;
  border-radius: 32px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.62)),
    linear-gradient(135deg, rgba(219, 234, 254, 0.52), rgba(209, 250, 229, 0.44));
  animation: fadeUp 0.5s ease both;
}

.summary-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.summary-main p {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 900;
  color: #3b82f6;
}

.summary-main h3 {
  margin: 0;
  font-size: 26px;
  line-height: 1.2;
  font-weight: 900;
}

.summary-main span {
  display: block;
  margin-top: 7px;
  font-size: 13px;
  line-height: 1.45;
  font-weight: 650;
  color: #6b7280;
}

.family-icon {
  width: 62px;
  height: 62px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  font-size: 27px;
  background: rgba(255, 255, 255, 0.74);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-top: 16px;
}

.summary-grid div {
  min-height: 68px;
  padding: 10px 6px;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.62);
}

.summary-grid strong {
  font-size: 22px;
  line-height: 1;
  font-weight: 900;
}

.summary-grid span {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
}

.hint-card {
  padding: 15px;
  border-radius: 28px;
  display: flex;
  align-items: flex-start;
  gap: 13px;
  animation: fadeUp 0.55s ease both;
}

.hint-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(239, 246, 255, 0.95);
}

.hint-card h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  color: #1d4ed8;
}

.hint-card p {
  margin: 5px 0 0;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 650;
  color: #475569;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.member-card {
  padding: 15px;
  border-radius: 30px;
  display: flex;
  gap: 13px;
  animation: fadeUp 0.58s ease both;
}

.avatar {
  width: 54px;
  height: 54px;
  flex: 0 0 auto;
  border-radius: 22px;
  display: grid;
  place-items: center;
  color: #1d4ed8;
  font-size: 22px;
  font-weight: 900;
  background: rgba(219, 234, 254, 0.95);
}

.member-card.emerald .avatar {
  color: #047857;
  background: rgba(209, 250, 229, 0.95);
}

.member-card.rose .avatar {
  color: #be123c;
  background: rgba(255, 228, 230, 0.95);
}

.member-card.amber .avatar {
  color: #b45309;
  background: rgba(254, 243, 199, 0.95);
}

.member-info {
  flex: 1;
  min-width: 0;
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.card-head h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 900;
}

.card-head p {
  margin: 4px 0 0;
  font-size: 12px;
  font-weight: 750;
  color: #64748b;
}

.delete-button {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 50%;
  flex: 0 0 auto;
  color: #94a3b8;
  font-size: 24px;
  line-height: 1;
  background: rgba(241, 245, 249, 0.8);
}

.condition {
  margin: 11px 0 0;
  padding: 10px 11px;
  border-radius: 18px;
  font-size: 12px;
  line-height: 1.5;
  font-weight: 650;
  color: #475569;
  background: rgba(248, 250, 252, 0.82);
}

.member-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 11px;
}

.member-stats span {
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 11px;
  line-height: 1;
  font-weight: 900;
  color: #2563eb;
  background: rgba(219, 234, 254, 0.82);
}

.fab {
  position: fixed;
  right: max(20px, calc((100vw - 480px) / 2 + 20px));
  bottom: calc(96px + env(safe-area-inset-bottom));
  z-index: 20;
  width: 58px;
  height: 58px;
  border-radius: 23px;
  display: grid;
  place-items: center;
}

.fab span {
  font-size: 30px;
  line-height: 1;
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

.cancel-sheet,
.save-sheet {
  min-height: 46px;
  border: 0;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 900;
}

.cancel-sheet {
  flex: 0.9;
  color: #475569;
  background: #f1f5f9;
}

.save-sheet {
  flex: 1.1;
  color: white;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  box-shadow: 0 12px 26px rgba(59, 130, 246, 0.22);
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
  .members-page {
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
}
</style>
