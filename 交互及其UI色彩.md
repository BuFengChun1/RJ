# 🎨 家庭用药管理 App - 设计系统与交互规范 (Design System & Interaction Specs)

> **AI 辅助开发指令：**
> 在后续的代码生成和 UI 完善过程中，请严格遵循本文件定义的色彩系统（基于 UnoCSS）和交互逻辑。不要使用默认的冷色系或蓝色系，我们的核心设计理念是**“温暖、治愈、家庭感”**。

## 1. 色彩规范 (Color System) - 暖色治愈系

应用整体采用柔和的暖橘/暖沙色调，降低医疗应用的冰冷感。以下是全局色彩对应的 UnoCSS/Tailwind 类名定义：

*   **🔥 主品牌色 (Primary Brand):** 
    *   主色：`text-orange-500` / `bg-orange-500` (`#F97316`) - 用于高亮状态、核心按钮（如“打卡”、“添加”）、底部导航栏激活图标。
    *   浅主色：`bg-orange-50` (`#FFF7ED`) - 用于选中卡片的背景、标签背景。
*   **⚠️ 状态语义色 (Semantic States):**
    *   **预警/临期 (Warning):** `text-amber-500` / `bg-amber-100` (`#F59E0B`) - 用于还有不到 30 天过期的药品标签。
    *   **危险/过期 (Danger):** `text-rose-500` / `bg-rose-100` (`#F43F5E`) - 用于已过期的药品标签，以及“删除”按钮。相比纯红色，玫瑰红更加柔和。
    *   **成功/健康 (Success):** `text-emerald-500` / `bg-emerald-100` (`#10B981`) - 用于“已服药”、“已开启提醒”的状态指示。
*   **🎨 背景与中性色 (Neutrals & Backgrounds):**
    *   **全局背景 (App Background):** `bg-stone-50` (`#FAFAF9`) - 带有微暖色的灰白，替代纯白或冷灰。
    *   **卡片/模块背景 (Card Background):** `bg-white` (`#FFFFFF`)，并统一增加柔和投影 `shadow-sm`。
    *   **主标题文字 (Heading):** `text-stone-800` (`#292524`)。
    *   **次要/辅助文字 (Secondary):** `text-stone-400` (`#A8A29E`)。

---

## 2. 全局交互与 UI 组件规范 (Global UI Principles)

1.  **触控友好 (Touch Targets):** 所有可点击元素（Button, 列表项, Tab）的最小高度必须为 `h-11` (44px)，防止移动端误触。
2.  **圆角规范 (Border Radius):** 
    *   大卡片、弹窗：`rounded-2xl`
    *   按钮、小标签：`rounded-lg` 或 `rounded-full`
3.  **微动效 (Micro-interactions):**
    *   **点击反馈：** 所有卡片和按钮添加 `transition-all active:scale-95 active:opacity-80`，提供真实的按压手感。
    *   **视图切换：** 页面切换时尽量保持平滑过渡，避免生硬闪烁。
4.  **空状态设计 (Empty States):** 当“药品清单”或“服药提醒”为空时，必须展示居中的缺省图/图标和温暖的提示语（如：“药箱空空如也，全家健健康康”），并提供一个明显的橙色 `+ 添加` 按钮。

---

## 3. 核心页面交互逻辑拆解 (Page Interactions)

### Layout (App.vue)
*   **TopNavBar:** 固定在顶部 `sticky top-0 z-50`，白底，底部有一条极细的分割线 `border-b border-stone-100`。
*   **BottomTabBar:** 固定在底部 `fixed bottom-0`。
    *   **未选中状态：** 图标和文字为 `text-stone-400`。
    *   **选中状态：** 图标和文字变为 `text-orange-500`，图标需稍微放大并加粗。

### 首页 (Home.vue)
*   **顶部问候区：** 展示柔和的橙色渐变背景块（`bg-gradient-to-br from-orange-400 to-orange-500 text-white`），根据时间动态显示问候语（早/中/晚）。
*   **快捷入口：** 使用网格布局（`grid grid-cols-2 gap-4`），将“录入药品”、“查看药店”等功能封装成大尺寸的可点击卡片。

### 药品清单 (MedicineList.vue)
*   **列表展示：** 使用卡片式列表，每个药品一张白色卡片 `bg-white rounded-2xl p-4 shadow-sm mb-3`。
*   **有效期高亮逻辑 (核心要求)：**
    *   **正常：** 仅显示日期，文字颜色 `text-stone-400`。
    *   **临期（如设定 < 30天）：** 右上角挂载 `bg-amber-100 text-amber-500` 标签。
    *   **过期：** 右上角挂载 `bg-rose-100 text-rose-500` 标签，且药品名称增加中划线 `line-through`，整个卡片透明度降低 `opacity-70`。
*   **删除交互：** 点击删除按钮后，必须弹出确认弹窗（“确定要将 [药品名] 移出家庭药箱吗？”），防止误删。

### 服药提醒 (Reminder.vue)
*   **列表排版：** 按时间顺序（如 08:00, 12:00, 19:00）纵向排列提醒卡片。
*   **开关控件 (Toggle Switch)：** 
    *   每个提醒项右侧自带一个 Switch 开关。
    *   开启时为暖橘色 `bg-orange-500`，关闭时为中性灰 `bg-stone-300`。
*   **打卡状态：** 若已到时间且用户点击了“已服药”，卡片背景变更为 `bg-emerald-50`，左侧图标打勾。

### 附近药店 (Pharmacy.vue)
*   **信息展示：** 列表项左侧为药店名称、距离（用 `text-orange-500` 强调距离，如 "500m"）、营业时间。
*   **拨号动作：** 右侧放置一个圆形的拨号图标按钮 `bg-orange-100 text-orange-500 rounded-full p-2`。点击该按钮时，触发 `window.location.href = 'tel:电话号码'`。

---

## 4. UnoCSS 配置更新建议 (给 Claude 的指引)

在解析此文档后，请检查 `uno.config.js`，确保配置了安全的预设和可能需要的特定字体配置。无需过度自定义颜色，直接使用 UnoCSS 默认的 `orange-500`, `amber-500`, `rose-500`, `stone-50` 即可完美契合上述设计。