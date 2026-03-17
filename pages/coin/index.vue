<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col"
  >
    <!-- Header -->
    <CoinHeadBar />

    <main class="flex-1 p-6">
      <!-- จำกัดความกว้างและจัดกลาง -->
      <div class="max-w-lg w-full mx-auto space-y-8">
        <!-- Section: ใช้ภาพจากไหน -->
        <section
          class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
        >
          <div class="flex items-center space-x-2 mb-6">
            <Icon name="lucide:image-plus" class="w-5 h-5 text-blue-600" />
            <h2 class="font-semibold text-gray-800">ใช้ภาพจากไหนดี ?</h2>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button
              @click="useCamera"
              class="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105"
            >
              <div
                class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors"
              >
                <Icon name="lucide:camera" class="w-6 h-6 text-white" />
              </div>
              <span class="font-medium text-blue-700">กล้อง</span>
              <span class="text-sm text-blue-500 mt-1">ถ่ายภาพใหม่</span>
            </button>

            <!-- ปุ่มแกลเลอรี -->
            <button
              @click="useGallery"
              class="group flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105"
            >
              <div
                class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-600 transition-colors"
              >
                <Icon name="lucide:folder-open" class="w-6 h-6 text-white" />
              </div>
              <span class="font-medium text-purple-700">แกลเลอรี</span>
              <span class="text-sm text-purple-500 mt-1">เลือกจากอัลบั้ม</span>
            </button>
          </div>
        </section>

        <!-- ซ่อน input file สำหรับกล้อง -->
        <input
          ref="cameraInput"
          type="file"
          accept="image/*"
          capture="environment"
          class="hidden"
          @change="handleFile"
        />

        <!-- ซ่อน input file สำหรับแกลเลอรี -->
        <input
          ref="galleryInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFile"
        />

        <!-- Section: แสดงภาพที่เลือก -->
        <section
          v-if="selectedImage"
          class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-2">
              <Icon name="lucide:image" class="w-5 h-5 text-green-600" />
              <h2 class="font-semibold text-gray-800">ภาพที่เลือก</h2>
            </div>
            <button
              @click="clearSelectedImage"
              class="text-red-500 hover:text-red-700 transition-colors"
            >
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <div class="relative rounded-xl overflow-hidden">
            <img
              :src="selectedImage"
              alt="Selected image"
              class="w-full h-64 object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
            ></div>
          </div>

          <!-- ปุ่มประมวลผล -->
          <div class="mt-6 flex gap-4">
            <button
              @click="processImage"
              :disabled="processing"
              class="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="processing" class="flex items-center justify-center">
                <Icon
                  name="lucide:loader-2"
                  class="w-5 h-5 mr-2 animate-spin"
                />
                กำลังประมวลผล...
              </span>
              <span v-else class="flex items-center justify-center">
                <Icon name="lucide:search" class="w-5 h-5 mr-2" />
                นับเหรียญ
              </span>
            </button>
          </div>
        </section>

        <!-- แสดงภาพที่ label แล้ว - แสดงเฉพาะเมื่อมีผลลัพธ์และมี labeledImage -->
        <section
          v-if="result && result.labeledImage"
          class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
        >
          <div class="flex items-center space-x-2 mb-4">
            <Icon name="lucide:scan" class="w-5 h-5 text-blue-600" />
            <h3 class="font-semibold text-gray-800">ภาพที่มีการตรวจจับ</h3>
          </div>
          <div class="rounded-xl overflow-hidden">
            <img
              :src="result.labeledImage"
              alt="Labeled Image"
              class="w-full h-auto object-contain"
            />
          </div>
        </section>

        <!-- Section: ผลลัพธ์ -->
        <section
          v-if="result"
          class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
        >
          <div class="flex items-center space-x-2 mb-6">
            <Icon name="lucide:trophy" class="w-5 h-5 text-yellow-600" />
            <h2 class="font-semibold text-gray-800">ผลลัพธ์</h2>
          </div>

          <div
            class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200"
          >
            <div class="text-center">
              <div class="text-4xl font-bold text-green-600 mb-2">
                {{ result.count }}
              </div>
              <div class="text-lg text-green-700">เหรียญที่พบ</div>
              <div class="text-2xl font-semibold text-green-800 mt-4">
                {{ result.totalValue }} บาท
              </div>
            </div>
          </div>

          <!-- รายละเอียดเหรียญ -->
          <div v-if="result.details && result.details.length > 0" class="mt-6">
            <h3 class="font-semibold text-gray-800 mb-4">รายละเอียดเหรียญ:</h3>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="detail in result.details"
                :key="detail.type"
                class="bg-gray-50 p-4 rounded-xl"
              >
                <div class="flex items-center justify-between">
                  <span class="text-gray-700">{{ detail.type }}</span>
                  <span class="font-semibold text-gray-900">{{
                    detail.count
                  }}</span>
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ detail.value }} บาท
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section: ภาพตัวอย่าง -->
        <section
          class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-2">
              <Icon name="lucide:image" class="w-5 h-5 text-green-600" />
              <h2 class="font-semibold text-gray-800">ภาพตัวอย่าง</h2>
            </div>
          </div>

          <!-- Image Slider -->
          <section>
            <div class="relative">
              <!-- Slider Container -->
              <div
                class="relative overflow-hidden rounded-xl bg-gray-100 aspect-video"
              >
                <div
                  class="flex transition-transform duration-500 ease-in-out h-full"
                  :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
                >
                  <div
                    v-for="(slide, index) in slides"
                    :key="index"
                    class="w-full flex-shrink-0 relative"
                  >
                    <img
                      :src="slide.image"
                      :alt="slide.title"
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                    ></div>
                    <div class="absolute bottom-4 left-4 text-white">
                      <h3 class="font-semibold">{{ slide.title }}</h3>
                      <p class="text-sm opacity-90">{{ slide.description }}</p>
                    </div>
                  </div>
                </div>

                <!-- Navigation Arrows -->
                <button
                  @click="previousSlide"
                  class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <span class="text-gray-700 text-xl">&lt;</span>
                </button>

                <button
                  @click="nextSlide"
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <span class="text-gray-700 text-xl">&gt;</span>
                </button>

                <!-- Slide Indicators -->
                <div class="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    v-for="(slide, index) in slides"
                    :key="index"
                    @click="goToSlide(index)"
                    class="w-2 h-2 rounded-full transition-all duration-200"
                    :class="currentSlide === index ? 'bg-white' : 'bg-white/50'"
                  ></button>
                </div>

                <!-- Auto-play indicator -->
                <div
                  class="absolute top-4 right-4 flex items-center space-x-2 bg-black/20 rounded-full px-3 py-1"
                >
                  <span class="text-white text-xs">Auto</span>
                </div>
              </div>

              <!-- Slide Info -->
              <div class="mt-4 text-center">
                <p class="text-sm text-gray-600">
                  {{ currentSlide + 1 }} / {{ slides.length }} -
                  <span class="text-blue-600">{{
                    slides[currentSlide].title
                  }}</span>
                </p>
              </div>
            </div>
          </section>
        </section>

        <!-- Tips Section -->
        <CoinTipsSection />
        <!-- Additional Features Section -->
        <div class="p-6 rounded-2xl shadow-xl border border-gray-100"></div>
      </div>
    </main>

    <!-- Bottom Nav -->
    <CoinNavButton />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
const router = useRouter();
const { showError } = useStore();

definePageMeta({
  middleware: "protected",
});

// Types
interface CoinDetail {
  type: string;
  count: number;
  value: number;
}

interface ProcessResult {
  count: number;
  totalValue: number;
  details: CoinDetail[];
  labeledImage: string;
}

// Refs
const cameraInput = ref<HTMLInputElement | null>(null);
const galleryInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const processing = ref(false);
const result = ref<ProcessResult | null>(null);

// ฟังก์ชันเรียกใช้กล้องและแกลเลอรี
const useCamera = () => cameraInput.value?.click();
const useGallery = () => galleryInput.value?.click();

// อ่านไฟล์และเก็บไฟล์จริงกับ base64 สำหรับแสดงภาพ
const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImage.value = e.target?.result as string;
      result.value = null; // reset ผลลัพธ์เก่า
    };
    reader.readAsDataURL(file);
  }
};

const clearSelectedImage = () => {
  selectedImage.value = null;
  selectedFile.value = null;
  result.value = null;
  if (cameraInput.value) cameraInput.value.value = "";
  if (galleryInput.value) galleryInput.value.value = "";
};

// ฟังก์ชันส่งรูปไปประมวลผลที่ backend (FastAPI)
const processImage = async () => {
  if (!selectedFile.value) return;
  processing.value = true;

  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    // 1. เรียก API ของ Python เพื่อประมวลผลภาพ
    const data = await $fetch<ProcessResult>("/api/coin/process", {
      method: "POST",
      body: formData,
    });
    result.value = data;

    // 2. <<-- เพิ่มส่วนนี้ -->>
    // หลังจากประมวลผลสำเร็จ ให้บันทึกผลลัพธ์ลง DB ผ่าน Nuxt Server API
    try {
      // ส่งเฉพาะข้อมูลที่จำเป็น ไม่ส่ง labeledImage เพื่อลดขนาด payload
      const historyData = {
        count: data.count,
        totalValue: data.totalValue,
        details: data.details,
      };
      
      const savedHistory = await $fetch("/api/history", {
        method: "POST",
        body: historyData,
      });
      console.log("History saved:", savedHistory);
      // อาจจะดีกว่าถ้าไปที่หน้ารายละเอียดเลย
      // router.push(`/history/${savedHistory.id}`);
    } catch (saveError: any) {
      console.error("Failed to save history:", saveError);
      showError({
        statusCode: saveError?.response?.status ?? 500,
        statusMessage: "Save Failed",
        message: "ไม่สามารถบันทึกผลลัพธ์ได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  } catch (e) {
    console.error("processImage error:", e);
  } finally {
    processing.value = false;
  }
};

// สไลด์โชว์ (เหมือนเดิม)
const currentSlide = ref(0);
const slides = ref([
  {
    image: "/images/coinEx1.jpg",
    title: "ตัวอย่างเหรียญ 1",
    description: "วิธีการถ่ายภาพที่ถูกต้อง",
  },
  {
    image: "/images/coinEx2.jpg",
    title: "ตัวอย่างเหรียญ 2",
    description: "มุมมองและแสงที่เหมาะสม",
  },
]);

let autoPlayInterval: number | null = null;
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};
const previousSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};
const goToSlide = (index: number) => {
  currentSlide.value = index;
  stopAutoPlay();
  setTimeout(startAutoPlay, 1000);
};
const startAutoPlay = () => {
  autoPlayInterval = window.setInterval(nextSlide, 4000);
};
const stopAutoPlay = () => {
  if (autoPlayInterval !== null) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
};
onMounted(() => {
  startAutoPlay();
});
onUnmounted(() => {
  stopAutoPlay();
});
</script>
