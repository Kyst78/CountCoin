<template>
  <header
    class="flex items-center justify-between p-4 bg-white shadow-lg backdrop-blur-sm bg-white/95"
  >
    <div class="flex items-center space-x-3">
      <div class="relative">
        <div
          class="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Icon name="lucide:calculator" class="w-4 h-4 text-white" />
        </div>
        <div
          class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
        ></div>
      </div>
      <span
        class="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        CountCoin
      </span>
    </div>
  </header>
</template>
<script setup lang="ts"></script>
