<script setup lang="ts">
import { onMounted } from 'vue';

import { Spinner } from '@/components/layout';
import { useAuthStore } from '@/store';

const authStore = useAuthStore();

onMounted(() => {
  authStore.login();
});
</script>

<template>
  <h1>Logging in...</h1>
  <Spinner />
</template>

<style lang="scss" scoped>
h1 {
  margin-top: 10rem;
  text-align: center;
}
.p-progress-spinner {
  display: flex;
  margin-top: 4rem;
  position: relative;
}
</style>
