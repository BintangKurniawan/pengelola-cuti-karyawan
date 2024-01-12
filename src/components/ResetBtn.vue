<template>
  <q-btn
    color="primary"
    text-color="white"
    class="capitalize rounded-3xl w-[270px] h-[56px]"
    @click="dialog = true"
    label="Reset Password"
  >
  </q-btn>
  <div>
    <q-dialog v-model="dialog">
      <q-card class="bg-white">
        <q-card-section>
          <h6 class="font-bold text-center">Reject Password</h6>
        </q-card-section>

        <q-card-section>
          <p class="text-center text-[#a0a0a0]">
            Are you sure want to reset password of this employee?
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
          <!-- <div
            class="text-negative bg-[#FBE7E8] px-10 py-2 font-bold rounded-lg text-center cursor-pointer"
            @click="acc(id)">
            Reset
          </div> -->
          <q-btn
            label="Reset"
            unelevated
            text-color="negative"
            class="danger px-10 py-2 font-bold rounded-lg text-center"
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
  components: {
    Icon,
  },
};
</script>

<style lang="scss" scoped>
.danger {
  background-color: #fbe7e8;
}
</style>
