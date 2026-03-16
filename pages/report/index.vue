<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <CoinHeadBar />
    <main class="p-6">
      <div class="max-w-2xl mx-auto space-y-8">
        <!-- Header with Back Button -->
        <div class="flex items-center justify-between">
          <NuxtLink
            to="/history"
            class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            <Icon name="lucide:arrow-left" class="w-5 h-5" />
            <span class="font-medium">กลับไปที่ประวัติ</span>
          </NuxtLink>

          <div class="text-sm text-gray-500">รวม {{ ids.length }} รายการ</div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="text-center p-12">
          <div class="inline-flex items-center space-x-3">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            ></div>
            <p class="text-gray-600 font-medium">กำลังสร้างรายงานสรุป...</p>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="bg-red-50 border border-red-200 p-6 rounded-2xl"
        >
          <div class="flex items-center space-x-3">
            <Icon name="lucide:alert-circle" class="w-6 h-6 text-red-500" />
            <div>
              <h3 class="font-semibold text-red-800">ไม่พบรายงาน</h3>
              <p class="text-red-700">เลือกข้อมูลที่หน้าประวัติเพื่อทำรายงาน</p>
            </div>
          </div>
        </div>

        <!-- Main Report Content -->
        <div v-else-if="summary" class="space-y-8">
          <!-- Summary Card -->
          <section
            class="bg-white p-8 rounded-3xl shadow-lg border border-gray-200"
          >
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">รายงานสรุป</h2>
              <p class="text-gray-600">สรุปมูลค่าเหรียญทั้งหมด</p>
            </div>

            <div
              class="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200 text-center"
            >
              <div class="space-y-4">
                <div>
                  <div class="text-5xl font-bold text-blue-600 mb-2">
                    {{ summary.totalValue.toLocaleString() }}
                  </div>
                  <div class="text-xl text-blue-700 font-medium">บาท</div>
                </div>

                <div class="border-t border-blue-200 pt-4">
                  <div class="text-3xl font-semibold text-blue-800">
                    {{ summary.totalCoins.toLocaleString() }}
                  </div>
                  <div class="text-lg text-blue-700">เหรียญทั้งหมด</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Detailed Breakdown -->
          <section
            v-if="summary.aggregatedDetails.length > 0"
            class="bg-white p-8 rounded-3xl shadow-lg border border-gray-200"
          >
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Icon name="lucide:coins" class="w-6 h-6 mr-2 text-yellow-500" />
              รายละเอียดเหรียญแต่ละประเภท
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="detail in summary.aggregatedDetails"
                :key="detail.type"
                class="group hover:shadow-md transition-shadow bg-gray-50 hover:bg-gray-100 p-6 rounded-xl border border-gray-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center"
                    >
                      <span class="text-yellow-600 font-bold text-sm">{{
                        detail.displayValue
                      }}</span>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-800">
                        {{ detail.displayValue }} บาท
                      </div>
                      <div class="text-sm text-gray-600">
                        เหรียญ {{ detail.displayValue }} บาท
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-gray-900">
                      {{ detail.count.toLocaleString() }}
                    </div>
                    <div class="text-sm text-gray-600">เหรียญ</div>
                  </div>
                </div>

                <!-- Value calculation -->
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">มูลค่ารวม</span>
                    <span class="font-semibold text-green-600">
                      {{ (detail.count * detail.value).toLocaleString() }}
                      บาท
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Statistics Section -->
          <section
            class="bg-white p-8 rounded-3xl shadow-lg border border-gray-200"
          >
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Icon
                name="lucide:bar-chart-3"
                class="w-6 h-6 mr-2 text-green-500"
              />
              สถิติเพิ่มเติม
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="text-center p-4 bg-green-50 rounded-xl">
                <div class="text-2xl font-bold text-green-600">
                  {{ summary.aggregatedDetails.length }}
                </div>
                <div class="text-sm text-green-700">ประเภทเหรียญ</div>
              </div>

              <div class="text-center p-4 bg-orange-50 rounded-xl">
                <div class="text-2xl font-bold text-orange-600">
                  {{ ids.length }}
                </div>
                <div class="text-sm text-orange-700">ครั้งที่นับ</div>
              </div>
            </div>
          </section>

          <!-- Action Buttons -->
          <section class="flex flex-col sm:flex-row gap-4">
            <button
              @click="exportReport"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Icon name="lucide:download" class="w-5 h-5" />
              <span>ส่งออกรายงาน</span>
            </button>

            <button
              @click="shareReport"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Icon name="lucide:share-2" class="w-5 h-5" />
              <span>แชร์รายงาน</span>
            </button>
          </section>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center p-12">
          <Icon
            name="lucide:file-x"
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-lg font-semibold text-gray-600 mb-2">ไม่พบข้อมูล</h3>
          <p class="text-gray-500">ไม่พบข้อมูลสำหรับสร้างรายงาน</p>
        </div>
      </div>
      <div class="p-12"></div>
    </main>
    <CoinNavButton />
  </div>
</template>

<script setup lang="ts">
import { Prisma } from "@prisma/client";

definePageMeta({
  middleware: "protected",
});

// Define the type for a ProcessingHistory record that includes its details
type HistoryWithDetails = Prisma.ProcessingHistoryGetPayload<{
  include: {
    details: true;
  };
}>;

const route = useRoute();
const ids = (route.query.ids as string)?.split(",") || [];

// Function to convert coin type to actual value
const getCoinValue = (type: string): number => {
  switch (type) {
    case "050":
      return 0.5;
    case "025":
      return 0.25;
    case "1":
      return 1;
    case "2":
      return 2;
    case "5":
      return 5;
    case "10":
      return 10;
    default:
      return Number(type);
  }
};

// Function to get display value for coin type
const getDisplayValue = (type: string): string => {
  switch (type) {
    case "050":
      return "0.5";
    case "025":
      return "0.25";
    default:
      return type;
  }
};

// Fetch data from the new report endpoint using POST method
const {
  data: reportData,
  pending,
  error,
} = await useFetch<HistoryWithDetails[]>("/api/report", {
  method: "POST",
  body: { ids },
  lazy: false,
});

// Computed property to calculate the summary
const summary = computed(() => {
  if (!reportData.value || reportData.value.length === 0) {
    return null;
  }

  // Recalculate total value with correct coin values
  const totalValue = reportData.value.reduce((sum, record) => {
    const recordValue = record.details.reduce((detailSum, detail) => {
      return detailSum + detail.count * getCoinValue(detail.type.toString());
    }, 0);
    return sum + recordValue;
  }, 0);

  const totalCoins = reportData.value.reduce(
    (sum, record) => sum + record.totalCount,
    0
  );

  const coinCounts: Record<string, number> = {};

  reportData.value.forEach((record) => {
    record.details.forEach((detail) => {
      const type = detail.type.toString();
      if (!coinCounts[type]) {
        coinCounts[type] = 0;
      }
      coinCounts[type] += detail.count;
    });
  });

  const aggregatedDetails = Object.entries(coinCounts)
    .map(([type, count]) => ({
      type,
      count,
      value: getCoinValue(type),
      displayValue: getDisplayValue(type),
    }))
    .sort((a, b) => b.value - a.value);

  return {
    totalValue,
    totalCoins,
    aggregatedDetails,
  };
});

// Function to export report
const exportReport = () => {
  if (!summary.value) return;

  const reportText = `
รายงานสรุปเหรียญ
=================
มูลค่ารวม: ${summary.value.totalValue.toLocaleString()} บาท
จำนวนเหรียญทั้งหมด: ${summary.value.totalCoins.toLocaleString()} เหรียญ

รายละเอียด:
${summary.value.aggregatedDetails
  .map(
    (detail) =>
      `- เหรียญ ${
        detail.displayValue
      } บาท: ${detail.count.toLocaleString()} เหรียญ (${(
        detail.count * detail.value
      ).toLocaleString()} บาท)`
  )
  .join("\n")}

สร้างเมื่อ: ${new Date().toLocaleDateString("th-TH")}
  `;

  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `coin-report-${new Date().toISOString().split("T")[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// Function to share report
const shareReport = async () => {
  if (!summary.value) return;

  const shareText = `รายงานสรุปเหรียญ\nมูลค่ารวม: ${summary.value.totalValue.toLocaleString()} บาท\nจำนวนเหรียญ: ${summary.value.totalCoins.toLocaleString()} เหรียญ`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "รายงานสรุปเหรียญ",
        text: shareText,
      });
    } catch (error) {
      console.log("การแชร์ถูกยกเลิก");
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(shareText);
    alert("คัดลอกรายงานไปยังคลิปบอร์ดแล้ว");
  }
};
</script>
