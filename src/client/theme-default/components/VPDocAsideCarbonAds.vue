<script setup lang="ts" vapor>
import { defineAsyncComponent } from 'vue'
import type { DefaultTheme } from 'vitepress/theme'

defineProps<{
  carbonAds: DefaultTheme.CarbonAdsOptions
}>()

const VPCarbonAds = __CARBON__
  ? defineAsyncComponent(() => import('./VPCarbonAds.vue'))
  : () => null
</script>

<template>
  <div class="VPDocAsideCarbonAds">
    <VPCarbonAds :carbon-ads="carbonAds" />
  </div>
</template>
