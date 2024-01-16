<template>
  <div>
    <q-btn
      @click="dialog = true"
      label="Reject"
      unelevated
      text-color="negative"
      class="font-bold round text-center capitalize px-4 mx-4 my-0 py-0 h-[21px]"
    />
    <q-dialog v-model="dialog">
      <q-card class="bg-white">
        <q-card-section>
          <h6 class="font-bold text-center">Reject Optional Leave</h6>
        </q-card-section>

        <q-card-section>
          <p class="text-center text-[#a0a0a0]">
            Are you sure want to reject this optional leave?
          </p>
        </q-card-section>

        <q-card-section class="flex items-center gap-4 w-full justify-between">
          <div
            class="text-secondary rounded-lg flex items-center gap-2 cursor-pointer"
            @click="dialog = false"
          >
            <Icon icon="mdi:arrow-collapse-left" size="24" />
            Back
          </div>

          <q-btn
            label="Reject"
            @click="acc(id)"
            unelevated
            text-color="negative"
            class="font-bold round text-center capitalize px-10 py-2"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
export default {
  data() {
    return {
      dialog: ref(false),
    };
  },
  props: {
    id: Number,
  },
  components: {
    Icon,
  },
  methods: {
    acc(id) {
      console.log(id);
    },
  },
};
</script>

<style lang="scss" scoped>
.round {
  background-color: #fbe7e8;
  border-radius: 8px;
}
</style>
