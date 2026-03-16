<template>
  <div class="min-h-screen bg-gray-50">
    <CoinHeadBar />
    <main class="p-6">
      <div class="max-w-lg mx-auto space-y-8">
        <NuxtLink
          to="/history"
          class="flex items-center space-x-2 text-blue-600 hover:underline"
        >
          <Icon name="lucide:arrow-left" class="w-5 h-5" />
          <span>กลับไปที่ประวัติทั้งหมด</span>
        </NuxtLink>

        <div v-if="pending" class="text-center p-10">
          <p>กำลังโหลดรายละเอียด...</p>
        </div>

        <div v-else-if="error" class="bg-red-100 p-4 rounded-lg text-red-700">
          <p>ไม่พบข้อมูลประวัติ หรือเกิดข้อผิดพลาด</p>
        </div>

        <div v-else-if="historyDetail" class="space-y-8">
          <section class="bg-white p-6 rounded-2xl shadow-xl">
            <h3 class="font-semibold text-gray-800 mb-4">ภาพที่ตรวจจับ</h3>
            <div class="rounded-xl overflow-hidden border">
              <img
                :src="historyDetail.labeledImage"
                alt="Labeled Image"
                class="w-full h-auto object-contain"
              />
            </div>
          </section>

          <section class="bg-white p-6 rounded-2xl shadow-xl">
            <h2 class="font-semibold text-gray-800 mb-4">ผลลัพธ์</h2>
            <div
              class="bg-green-50 p-6 rounded-xl border border-green-200 text-center"
            >
              <div class="text-4xl font-bold text-green-600">
                {{ historyDetail.totalCount }}
              </div>
              <div class="text-lg text-green-700">เหรียญที่พบ</div>
              <div class="text-2xl font-semibold text-green-800 mt-4">
                {{ historyDetail.totalValue }} บาท
              </div>
            </div>

            <div v-if="historyDetail.details.length > 0" class="mt-6">
              <h3 class="font-semibold text-gray-800 mb-4">
                รายละเอียดเหรียญ:
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <div
                  v-for="detail in historyDetail.details"
                  :key="detail.id"
                  class="bg-gray-50 p-4 rounded-xl"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-gray-700">{{ detail.type }} บาท</span>
                    <span class="font-semibold text-gray-900"
                      >{{ detail.count }} เหรียญ</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="p-6 rounded-2xl shadow-xl border border-gray-100"></div>
      </div>
    </main>
    <CoinNavButton />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "protected",
});

const route = useRoute();
const historyId = route.params.id as string;

const {
  data: historyDetail,
  pending,
  error,
} = await useFetch(`/api/history/${historyId}`, {
  lazy: true,
});
</script>
