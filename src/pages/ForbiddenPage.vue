<template>
  <div class="flex items-center flex-col justify-center gap-6 text-center">
    <q-img
      src="src/assets/img/forbidden.svg"
      alt="forbidden"
      class="w-96 h-72 md:w-[700px] md:h-auto"
      ratio=""
    />

    <q-btn
      @click="navigate.push('/')"
      unelevated
      rounded
      color="primary"
      label="back"
      text-color="white"
      class="px-8"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ForbiddenPage',
  setup() {
    const navigate = useRouter();
    return { navigate };
  },
});
</script>
