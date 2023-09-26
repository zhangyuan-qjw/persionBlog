<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <div :key="router.path">
          <component :is="Component"></component>
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router"

const router = useRoute()
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>