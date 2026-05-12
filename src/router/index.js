import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MedicineList from '../views/MedicineList.vue'
import Reminder from '../views/Reminder.vue'
import Pharmacy from '../views/Pharmacy.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/medicine', name: 'MedicineList', component: MedicineList },
  { path: '/reminder', name: 'Reminder', component: Reminder },
  { path: '/pharmacy', name: 'Pharmacy', component: Pharmacy },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
