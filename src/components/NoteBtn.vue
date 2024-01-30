<template>
  <q-btn
    color="primary"
    label="Note"
    class="rounded-xl capitalize"
    @click="dialog = true"
  >
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
};
</script>

<style lang="scss" scoped></style>
