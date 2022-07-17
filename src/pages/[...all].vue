<template>
  <div class="pt-20">
    <n-space vertical justify="center" align="center" class="h-full w-full">
      <div>
        <n-icon size="99">
          <i-teenyicons-mood-surprised-outline />
        </n-icon>
        <p class="text-center">你在找啥?</p>
      </div>
      <div>
        <n-button @click="router.toHome()">点我试试</n-button>
      </div>
    </n-space>
  </div>
</template>

<script setup lang="ts">
  import { useRouterPush } from '@/router/router';

  const router = useRouterPush();
</script>

<style scoped></style>
