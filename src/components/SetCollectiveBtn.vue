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

          <p class="text-secondary font-semibold">
            Amount of leave is
            {{ calculateLeaveAmount(startLeave, endLeave) }} day(s)
          </p>
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
      successNotif(msg) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'primary',
          multiLine: true,
        });
      },
      failedNotif(msg1) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg1}`,

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
      // FOR SELECTED typeLeave IN Q-SELECT
      typeLeave: null,
      //  FOR Q-SELECT
      typeLeaveOptions: [
        { value: 1, label: 'Mandatory' },
        { value: 2, label: 'Optional' },
      ],
      // TO RECEIVE typeLeave ID
      leaveId: '',
    };
  },

  components: {
    Icon,
  },

  methods: {
    // SET COLLECTIVE LEAVE
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
          this.dialog = false;
          this.leaveId = '';
          this.reason = '';
          this.startLeave = '';
          this.endLeave = '';
          console.log(resp);
          this.successNotif(resp.data.message);
        })
        .catch((err) => {
          if (err.response) {
            // if (err.response.data.data[0].code) {
            //   const msg = err.response.data.data[0].code;
            //   const msg2 = err.response.data.message;
            //   this.failedNotif(msg, msg2);
            // }
            const msg = err.response.data.message;

            this.failedNotif(msg);
          }
        });
    },

    // TO RECEIVE typeLeave ID
    updateLeaveId() {
      this.leaveId = this.typeLeave.value;

      console.log(this.leaveId);
    },

    calculateLeaveAmount(startLeave, endLeave) {
      const startDate = new Date(startLeave);
      const endDate = new Date(endLeave);

      let totalDays = 0;

      while (startDate <= endDate) {
        const dayOfWeek = startDate.getDay();

        // Jika bukan Sabtu (6) atau Minggu (0), tambahkan ke totalDays
        if (dayOfWeek !== 6 && dayOfWeek !== 0) {
          totalDays++;
        }

        // Tambah satu hari ke startDate
        startDate.setDate(startDate.getDate() + 1);
      }

      return totalDays;
    },
  },
};
</script>

<style lang="scss" scoped>
.round {
  border-radius: 8px;
}
</style>
