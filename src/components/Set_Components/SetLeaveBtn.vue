<template>
  <q-btn
    color="primary"
    text-color="white"
    class="capitalize rounded-3xl"
    @click="openDialog(id)"
  >
    <div class="flex items-center justify-center gap-1">
      <p>{{ text }}</p>
    </div>
  </q-btn>
  <div>
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-full px-4 pb-4">
        <q-card-section>
          <h6 class="font-bold text-center">
            {{ page === 'dashboard' ? 'Set Leave' : 'Leave Application' }}
          </h6>
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
              @update:model-value="typeLeaveUpdate"
              label="Type Leave"
            >
            </q-select>
          </div>

          <div class="flex flex-col items-start gap-2 w-full" v-if="special">
            <p class="text-primary font-semibold">Special Leave List</p>
            <q-select
              outlined
              class="w-full"
              label-color="Primary"
              v-model="specialLeaveSelected"
              :options="specialLeaveOptions"
              emit-value
              map-options
              label="Type Leave"
            >
            </q-select>
          </div>

          <div class="flex flex-col items-start gap-2 w-full" v-if="!special">
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

          <div class="flex flex-col items-start gap-2 w-full" v-if="!special">
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

          <p class="text-secondary font-semibold" v-if="!special">
            Amount of leave is
            {{ calculateLeaveAmount(startLeave, endLeave) }} day(s)
          </p>
        </div>

        <div class="flex items-center gap-2 w-full justify-between mt-4">
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
            :disable="totalDays > 8 || totalDays === 0"
            @click="setLeave(id)"
            text-color="white"
            class="font-bold round text-center capitalize px-10 py-2"
          />
        </div>
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
          message: 'Leave created',
          timeout: 3000,
          color: 'primary',
          multiLine: true,
        });
      },
      failedNotif(msg) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
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
      totalDays: 0,
      typeLeave: 'Personal',
      typeLeaveOptions: ['Personal', 'Special'],
      special: false,

      specialLeaveSelected: ref(null),
      specialLeaveOptions: [],
    };
  },
  props: {
    id: String,
    page: String,
    text: String,
  },
  components: {
    Icon,
  },

  methods: {
    openDialog(id) {
      this.dialog = true;
      this.getSpecialLeaveList(id);
      console.log(this.page);
    },
    typeLeaveUpdate() {
      this.special = !this.special;
      this.specialLeaveId = '';
      console.log(this.specialLeaveId);
    },
    async getSpecialLeaveList(id) {
      await api
        .get(`leave/special-leave/gender/${id}`, { withCredentials: true })
        .then((res) => {
          const leaveList = res.data.data;

          const mapList = leaveList.map((leave) => {
            return {
              value: leave.id,
              label: leave.leaveTitle,
            };
          });

          this.specialLeaveOptions = mapList;
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // TO SET PERSONAL LEAVEE
    async setLeave(id) {
      if (!this.special) {
        await api
          .post(
            `/leave/personal/${id}`,
            {
              reason: this.reason,
              startLeave: this.startLeave,
              endLeave: this.endLeave,
            },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            console.log(res);
            this.successNotif();
            this.reason = '';
            this.startLeave = '';
            this.endLeave = '';
            this.dialog = false;

            setInterval(() => {
              if (this.page === 'dashboard') {
                this.$router.push('/admin/list-leave?type=Ordinary');
              }
              setInterval(() => {
                window.location.reload();
              }, 1000);
            }, 2000);
          })
          .catch((err) => {
            if (err.response) {
              const msg = err.response.data.message;
              this.failedNotif(msg);
            }
          });
      } else {
        await api
          .post(
            `/leave/employee-special-leave/${id}`,
            {
              specialLeaveId: this.specialLeaveSelected,
              startLeave: this.startLeave,
            },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            this.successNotif();
            this.specialLeaveId = '';
            this.startLeave = '';
            this.dialog = false;
            setInterval(() => {
              if (this.page === 'dashboard') {
                this.$router.push('/admin/list-leave?type=Special');
              }
              setInterval(() => {
                window.location.reload();
              }, 1000);
            }, 2000);
          })
          .catch((err) => {
            if (err.response) {
              const msg = err.response.data.message;
              this.failedNotif(msg);
            }
          });
      }
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

      this.totalDays = totalDays;
      return totalDays;
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.round {
  border-radius: 8px;
}
</style>
