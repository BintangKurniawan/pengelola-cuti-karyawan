<template>
  <q-btn flat text-color="white" class="px-0" @click="dialog = true">
    <Icon icon="mdi:information-outline" width="24" class="text-primary" />
  </q-btn>
  <q-dialog v-model="dialog">
    <q-card class="bg-white w-full p-4">
      <q-card-section v-if="note">
        <p class="text-center"><b>Reject reason:</b> {{ note }}</p>
      </q-card-section>

      <q-card-section v-if="approveBy">
        <p class="text-center"><b>Approved by:</b> {{ approveBy }}</p>
      </q-card-section>
      <q-card-section v-if="rejectBy">
        <p class="text-center"><b>Rejected by:</b> {{ rejectBy }}</p>
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
    note: String,
    approveBy: String,
    rejectBy: String,
  },
  components: {
    Icon,
  },
};
</script>

<style lang="scss" scoped></style>
