<template>
  <div class="min-h-screen bg-gray-50">
    <CoinHeadBar />
    <main class="p-6">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center space-x-3 mb-6">
          <Icon name="lucide:history" class="w-7 h-7 text-blue-600" />
          <h1 class="text-2xl font-bold text-gray-800">ประวัติการนับเหรียญ</h1>
        </div>

        <div
          v-if="selectedItems.length > 0"
          class="mb-6 p-4 bg-blue-50 rounded-lg flex justify-between items-center"
        >
          <div>
            <p class="text-lg font-semibold text-blue-800">
              ยอดรวมที่เลือก: {{ totalSelectedValue }} บาท
            </p>
            <p class="text-sm text-blue-700">
              เลือก {{ selectedItems.length }} รายการ
            </p>
          </div>
          <button
            @click="generateReport"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            สร้างรายงาน
          </button>
        </div>

        <div v-if="pending" class="text-center p-10">
          <p>กำลังโหลดประวัติ...</p>
        </div>

        <div v-else-if="error" class="bg-red-100 p-4 rounded-lg text-red-700">
          <p>ไม่สามารถโหลดข้อมูลได้: {{ error.message }}</p>
        </div>

        <div
          v-else-if="!historyList || historyList.length === 0"
          class="text-center p-10 border-2 border-dashed rounded-xl"
        >
          <Icon name="lucide:archive" class="w-12 h-12 mx-auto text-gray-400" />
          <h3 class="mt-4 text-lg font-medium text-gray-700">
            ยังไม่มีประวัติ
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            ลองนับเหรียญครั้งแรกของคุณดูสิ!
          </p>
          <NuxtLink
            to="/coin"
            class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            ไปที่หน้านับเหรียญ
          </NuxtLink>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in historyList"
            :key="item.id"
            class="block bg-white p-5 rounded-xl shadow-md transition-all duration-300 border flex items-center space-x-4"
          >
            <input
              type="checkbox"
              :value="item.id"
              v-model="selectedItems"
              class="form-checkbox h-5 w-5 text-blue-600 rounded-md border-gray-300 focus:ring-blue-500"
              @click.stop
            />

            <div
              @click="goToDetail(item.id)"
              class="flex-grow flex items-center justify-between cursor-pointer"
            >
              <div>
                <p class="font-semibold text-gray-800">
                  ตรวจพบ {{ item.totalCount }} เหรียญ
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ new Date(item.createdAt).toLocaleString("th-TH") }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-green-600">
                  {{ item.totalValue }} บาท
                </p>
                <Icon
                  name="lucide:chevron-right"
                  class="w-5 h-5 text-gray-400 inline-block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-12"></div>
    </main>
    <CoinNavButton />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "protected",
});

const {
  data: historyList,
  pending,
  error,
} = await useFetch("/api/history", {
  lazy: true,
});

const selectedItems = ref<string[]>([]);

const goToDetail = (id: string) => navigateTo(`/history/${id}`);

const totalSelectedValue = computed(() => {
  if (!historyList.value) {
    return 0;
  }
  return selectedItems.value.reduce((sum, id) => {
    const item = historyList.value!.find((h) => h.id === id);
    return sum + (item?.totalValue || 0);
  }, 0);
});

// Function to navigate to the report page
const generateReport = () => {
  if (selectedItems.value.length === 0) return;
  const ids = selectedItems.value.join(",");
  navigateTo(`/report?ids=${ids}`);
};
</script>
