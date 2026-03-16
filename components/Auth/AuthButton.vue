<template>
  <div class="space-y-4">
    <div class="flex items-center justify-center w-full">
      <div class="flex-1 h-0.5 bg-gray-900 dark:bg-gray-400"></div>
      <span class="px-3 text-sm font-medium text-gray-700 dark:text-gray-200"
        >or</span
      >
      <div class="flex-1 h-0.5 bg-gray-900 dark:bg-gray-400"></div>
    </div>

    <a href="/api/auth/github" class="block">
      <UButton icon="i-lucide-github" square block color="gray">
        Continue with Github
      </UButton>
    </a>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
