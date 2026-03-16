<script setup lang="ts">
import { reactive } from "vue";
import { handleError } from "~/utils/error";
import AuthButton from "~/components/Auth/AuthButton.vue";
import type { FormSubmitEvent } from "#ui/types";
import { loginSchema, registerSchema } from "~/utils/schemas";
import type { LoginSchema, RegisterSchema } from "~/utils/schemas";
import useStore from "~/composables/useStore";

const items = [
  { slot: "login", label: "Login", description: "Enter your account to login" },
  {
    slot: "register",
    label: "Register",
    description: "Enter your crentials to create your account",
  },
];

const loginForm = reactive({
  email: "",
  password: "",
});

const registerForm = reactive({
  email: "",
  password: "",
  name: "",
});

const { isLoading, toggleLoading, showMessage, showError } = useStore();
const { fetch: refreshSession } = useUserSession();

async function login(event: FormSubmitEvent<LoginSchema>) {
  try {
    toggleLoading(true);

    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: event.data,
    });

    console.log("Login response:", response); // Debug log

    // Show success message
    showMessage({
      title: "เข้าสู่ระบบสำเร็จ",
      description: "กำลังนำคุณไปยังหน้าหลัก...",
    });

    // Wait a bit for the message to show
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await refreshSession();
    await navigateTo("/coin", { replace: true });
  } catch (error) {
    console.error("Login error:", error);
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
}

async function register(event: FormSubmitEvent<RegisterSchema>) {
  try {
    toggleLoading(true);

    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: event.data,
    });

    console.log("Register response:", response); // Debug log

    // Show success message
    showMessage({
      title: "สมัครสมาชิกสำเร็จ",
      description: "บัญชีของคุณถูกสร้างเรียบร้อยและได้เข้าสู่ระบบแล้ว",
    });

    // Wait a bit for the message to show
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await refreshSession();
    await navigateTo("/coin", { replace: true });
  } catch (error: any) {
    console.error("Register error:", error);
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
}

definePageMeta({
  layout: "auth",
});
</script>

<template>
  <UTabs :items="items" class="w-full max-w-md">
    <template #login="{ item }">
      <UCard>
        <template #header>
          <p
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ item.label }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ item.description }}
          </p>
        </template>

        <UForm
          :schema="loginSchema"
          class="space-y-4"
          @submit="login"
          :state="loginForm"
        >
          <UFormGroup label="Email" name="email">
            <UInput
              v-model="loginForm.email"
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              :disabled="isLoading"
            />
          </UFormGroup>
          <UFormGroup label="Password" name="password">
            <UInput
              v-model="loginForm.password"
              type="password"
              placeholder="กรอกรหัสผ่าน"
              :disabled="isLoading"
            />
          </UFormGroup>
          <div class="space-y-5 mt-5">
            <UButton
              block
              type="submit"
              :loading="isLoading"
              :disabled="isLoading"
            >
              {{ isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
            </UButton>
            <AuthButton :disabled="isLoading"></AuthButton>
          </div>
        </UForm>
      </UCard>
    </template>

    <template #register="{ item }">
      <UCard>
        <template #header>
          <p
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ item.label }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ item.description }}
          </p>
        </template>

        <UForm
          :schema="registerSchema"
          class="space-y-4"
          @submit="register"
          :state="registerForm"
        >
          <UFormGroup label="Name" name="name">
            <UInput
              v-model="registerForm.name"
              placeholder="กรอกชื่อของคุณ"
              :disabled="isLoading"
            />
          </UFormGroup>

          <UFormGroup label="Email" name="email">
            <UInput
              v-model="registerForm.email"
              type="email"
              placeholder="กรอกอีเมลของคุณ"
              :disabled="isLoading"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="registerForm.password"
              type="password"
              placeholder="กรอกรหัสผ่าน"
              :disabled="isLoading"
            />
          </UFormGroup>
          <div class="space-y-5 mt-5">
            <UButton
              block
              type="submit"
              :loading="isLoading"
              :disabled="isLoading"
            >
              {{ isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก" }}
            </UButton>
            <AuthButton :disabled="isLoading"></AuthButton>
          </div>
        </UForm>
      </UCard>
    </template>
  </UTabs>
</template>
