<script setup lang="ts">
definePageMeta({
  middleware: "protected",
});

await navigateTo("/coin", { replace: true });
</script>
