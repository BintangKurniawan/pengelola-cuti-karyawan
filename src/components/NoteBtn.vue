<template>
  <q-btn flat text-color="white" class="px-0" @click="dialog = true">
    <Icon icon="mdi:event-note" width="24" class="text-primary" />
  </q-btn>
  <q-dialog v-model="dialog">
    <q-card class="bg-white w-full">
      <q-card-section class="">
        <p class="text-center">{{ text }}</p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
export default {
  setup() {
    return {};
  },
  data() {
    return {
      dialog: ref(false),
    };
  },
  props: {
    text: String,
  },
  components: {
    Icon,
  },
};
</script>

<style lang="scss" scoped></style>
