<template>
  <section
    class="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl shadow-xl border border-yellow-200"
  >
    <div class="flex items-center space-x-2 mb-4">
      <Icon name="lucide:lightbulb" class="w-5 h-5 text-yellow-600" />
      <h2 class="font-semibold text-yellow-800">เคล็ดลับการถ่ายภาพ</h2>
    </div>
    <ul class="space-y-2 text-sm text-yellow-700">
      <li class="flex items-start space-x-2">
        <Icon name="lucide:check" class="w-4 h-4 mt-0.5 text-yellow-600" />
        <span>วางเหรียญบนพื้นผิวเรียบ สีขาวหรือสีอ่อน</span>
      </li>
      <li class="flex items-start space-x-2">
        <Icon name="lucide:check" class="w-4 h-4 mt-0.5 text-yellow-600" />
        <span>ใช้แสงธรรมชาติหรือแสงที่เพียงพอ</span>
      </li>
      <li class="flex items-start space-x-2">
        <Icon name="lucide:check" class="w-4 h-4 mt-0.5 text-yellow-600" />
        <span>ถ่ายจากด้านบนในระยะใกล้พอสมควร</span>
      </li>
      <li class="flex items-start space-x-2">
        <Icon name="lucide:check" class="w-4 h-4 mt-0.5 text-yellow-600" />
        <span>หลีกเลี่ยงเงาและแสงสะท้อน</span>
      </li>
    </ul>
  </section>
</template>
<script setup lang="ts"></script>
