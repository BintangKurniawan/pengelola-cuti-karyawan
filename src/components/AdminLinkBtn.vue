<template>
  <div
    @click="router.push(link)"
    :class="`relative group transition-all md:w-${width} w-${width} flex items-center  cursor-pointer pb-1 md:justify-start`"
  >
    <span
      class="h-[2px] inline-block bg-primary absolute left-0 bottom-0.5 group-hover:w-full transition-[width] ease duration-300"
      :class="$route.path === link ? 'w-full' : 'w-0'"
      >&nbsp;</span
    >
    <Icon :icon="'mdi:' + icon" width="24" />
    <p class="capitalize text-xs">{{ title }}</p>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

import { useRouter, useRoute } from 'vue-router';
export default {
  setup() {
    return {
      route: useRoute(),
      router: useRouter(),
    };
  },
  components: {
    Icon,
  },
  props: {
    title: String,
    link: String,
    icon: String,
    width: String,
  },
};
</script>

<style lang="scss" scoped></style>
