<script setup>
import { Analytics } from '@vercel/analytics/vue';
</script>

<template>
  <div>
    <router-view />
    <Analytics />
  </div>
</template>
