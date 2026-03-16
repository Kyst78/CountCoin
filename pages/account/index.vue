<script setup lang="ts">
definePageMeta({
  middleware: "protected",
});

const { user, clear } = useUserSession();

const handleLogout = async () => {
  await clear();
  await navigateTo("/auth");
};

// Contact methods
const contactMethods = [
  {
    name: "อีเมล",
    value: "thibet3463@gmail.com",
    icon: "lucide:mail",
    href: "mailto:thibet3463@gmail.com",
  },
  {
    name: "โทรศัพท์",
    value: "0646986666",
    icon: "lucide:phone",
    href: "tel:0646986666",
  },
  {
    name: "Line",
    value: "thibet3463",
    icon: "lucide:message-circle",
    href: "https://line.me/ti/p/thibet3463",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <CoinHeadBar />
    <main class="p-6">
      <div class="max-w-md mx-auto space-y-8">
        <section
          v-if="user"
          class="bg-white p-8 rounded-2xl shadow-lg text-center"
        >
          <img
            :src="user.avatarUrl || '/img/default-avatar.png'"
            alt="User Avatar"
            class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-200"
          />
          <h1 class="text-2xl font-bold text-gray-800">{{ user.name }}</h1>
          <p class="text-gray-500">{{ user.email }}</p>
        </section>

        <!-- Contact Us Section -->
        <section class="bg-white p-6 rounded-2xl shadow-lg">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Icon name="lucide:headphones" class="w-5 h-5 mr-2 text-blue-500" />
            ติดต่อเรา
          </h2>
          <div class="space-y-3">
            <div
              v-for="contact in contactMethods"
              :key="contact.name"
              class="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Icon :name="contact.icon" class="w-5 h-5 text-gray-600 mr-3" />
              <div class="flex-1">
                <p class="text-sm text-gray-500">{{ contact.name }}</p>
                <a
                  :href="contact.href"
                  class="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  {{ contact.value }}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section>
          <button
            @click="handleLogout"
            class="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <Icon name="lucide:log-out" class="w-5 h-5 mr-2" />
            <span>ออกจากระบบ</span>
          </button>
        </section>
      </div>
    </main>
    <CoinNavButton />
    <div class="p-12 rounded-2xl shadow-xl border border-gray-100"></div>
  </div>
</template>
