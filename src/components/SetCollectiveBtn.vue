<template>
  <div>
    <q-btn
      color="primary"
      text-color="white"
      class="capitalize rounded-3xl"
      @click="dialog = true"
    >
      <div class="flex items-center justify-center gap-1">
        <Icon icon="mdi:plus-circle-outline" size="24" />
        <p>Set Collective Leave</p>
      </div>
    </q-btn>
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-full px-4 pb-4">
        <q-card-section>
          <h6 class="font-bold text-center">Set Collective Leave</h6>
        </q-card-section>

        <div class="flex justify-between items-end gap-2 w-full">
          <div class="flex flex-col items-start gap-2 w-full">
            <p class="text-primary font-semibold">Type</p>
            <q-select
              outlined
              class="w-full"
              label-color="Primary"
              v-model="typeLeave"
              :options="typeLeaveOptions"
              @update:model-value="updateLeaveId"
              label="Collective Leave"
            >
            </q-select>
          </div>

          <div class="flex flex-col items-start gap-2 w-full">
            <p class="text-primary font-semibold">Reason</p>
            <q-input
              v-model="reason"
              outlined
              color="dark"
              bg-color="white"
              for="reason"
              placeholder="Reason"
              class="drop-shadow-sm w-full outline-none focus:bg-transparent active:bg-transparent"
            />
          </div>

          <div class="flex flex-col items-start gap-2 w-full">
            <p class="text-primary font-semibold">Start Leave</p>
            <q-input
              outlined
              for="date"
              color="dark"
              type="date"
              bg-color="white"
              class="w-full"
              v-model="startLeave"
            />
          </div>

          <div class="flex flex-col items-start gap-2 w-full">
            <p class="text-primary font-semibold">End Leave</p>
            <q-input
              outlined
              for="date"
              color="dark"
              type="date"
              bg-color="white"
              class="w-full"
              v-model="endLeave"
            />
          </div>
        </div>

        <q-card-section class="flex items-center gap-4 w-full justify-between">
          <div
            class="text-secondary rounded-lg flex items-center gap-2 cursor-pointer"
            @click="dialog = false"
          >
            <Icon icon="mdi:arrow-collapse-left" size="24" />
            Back
          </div>

          <q-btn
            label="Confirm"
            color="primary"
            unelevated
            @click="setCollectiveLeave"
            text-color="white"
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
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const $q = useQuasar();
    return {
      successNotif() {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: 'Collective leave created',
          color: 'primary',
          multiLine: true,
        });
      },
      failedNotif() {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: 'Failed to create collective leave',
          color: 'negative',
          multiLine: true,
        });
      },
    };
  },
  data() {
    return {
      dialog: ref(false),
      reason: '',
      startLeave: '',
      endLeave: '',
      typeLeave: null,
      typeLeaveOptions: [
        { value: 1, label: 'Mandatory' },
        { value: 2, label: 'Optional' },
      ],
      leaveId: 1,
    };
  },

  components: {
    Icon,
  },

  methods: {
    async setCollectiveLeave() {
      await api
        .post(
          '/leave/collective',
          {
            typeOfLeaveId: this.leaveId,
            reason: this.reason,
            startLeave: this.startLeave,
            endLeave: this.endLeave,
          },
          { withCredentials: true }
        )
        .then((resp) => {
          this.successNotif();
          this.dialog = false;
          this.leaveId = 1;
          this.reason = '';
          this.startLeave = '';
          this.endLeave = '';
          console.log(resp);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    updateLeaveId() {
      this.leaveId = this.typeLeave.value;

      console.log(this.leaveId);
    },
  },
};
</script>

<style lang="scss" scoped>
.round {
  border-radius: 8px;
}
</style>
