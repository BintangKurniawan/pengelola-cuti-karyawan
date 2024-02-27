<!-- just for ordinary component button -->

<template>
  <div
    @click="router.push(link)"
    :class="`relative group transition-all md:w-${width} w-${width} flex items-center gap-1 cursor-pointer pb-1 md:justify-start ${
      $route.path === link ? `text-primary` : ''
    }`"
    :style="{ color: $route.path === link ? color : '' }"
  >
    <span
      class="h-[2px] inline-block bg-primary absolute left-0 bottom-0.5 group-hover:w-full transition-[width] ease duration-300"
      :class="$route.path === link ? 'w-full' : 'w-0'"
      >&nbsp;</span
    >
    <Icon :icon="'mdi:' + icon" width="24" v-if="icon" />
    <p class="capitalize text-sm">{{ title }}</p>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';

import { useRouter, useRoute } from 'vue-router';
import { useColorStore } from 'src/stores/colorStore';
export default {
  setup() {
    const store = useColorStore();
    return {
      store,
      color: '',
      route: useRoute(),
      router: useRouter(),
    };
  },
  mounted() {
    const color = localStorage.getItem('color');
    this.store.setColor(color);
    this.color = this.store.primaryColor;
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
