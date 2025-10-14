<script setup lang="ts" vapor>
import { defineVaporAsyncComponent } from 'vue'
import type { DefaultTheme } from 'vitepress/theme'

defineProps<{
  carbonAds: DefaultTheme.CarbonAdsOptions
}>()

const VPCarbonAds = __CARBON__
  ? defineVaporAsyncComponent(() => import('./VPCarbonAds.vue') as any)
  : () => null
</script>

<template>
  <div class="VPDocAsideCarbonAds">
    <VPCarbonAds :carbon-ads="carbonAds" />
  </div>
</template>
