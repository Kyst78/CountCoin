<template>
  <nav
    class="fixed bottom-0 w-full bg-white border-t shadow grid grid-cols-4 text-center text-sm z-50"
  >
    <NuxtLink
      v-for="item in navItems"
      :key="item.name"
      :to="item.to"
      :class="[
        'flex flex-col items-center py-2 transition-all rounded-t-lg',
        route.path === item.to
          ? 'bg-yellow-100 text-yellow-600 font-semibold'
          : 'text-gray-500 hover:bg-gray-100',
      ]"
    >
      <component :is="item.icon" class="w-5 h-5 mb-1" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { Home, History, BarChart, User } from "lucide-vue-next";

const route = useRoute();

const navItems = [
  { name: "home", label: "หน้าหลัก", to: "/coin", icon: Home },
  { name: "history", label: "ประวัติ", to: "/history", icon: History },
  { name: "report", label: "รายงาน", to: "/report", icon: BarChart },
  { name: "account", label: "บัญชี", to: "/account", icon: User },
];
</script>
