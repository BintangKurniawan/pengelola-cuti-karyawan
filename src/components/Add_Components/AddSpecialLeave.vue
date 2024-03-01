<template>
  <q-btn
    color="primary"
    text-color="white"
    class="capitalize rounded-3xl"
    @click="dialog = true"
  >
    <div class="flex items-center justify-center gap-1">
      <Icon icon="mdi:plus-circle-outline" size="24" />
      <p>Add Special Leave</p>
    </div>
  </q-btn>

  <div>
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-full px-4 pb-4">
        <q-card-section>
          <h6 class="font-bold text-center">Add Special Leave</h6>
        </q-card-section>

        <div class="flex justify-between items-end gap-2 w-full">
          <div class="flex flex-col items-start gap-2 w-full">
            <p class="text-primary font-semibold">Special Leave Title</p>
            <q-input
              v-model="leaveTitle"
              outlined
              color="dark"
              bg-color="white"
              for="leave"
              placeholder="Leave"
              class="drop-shadow-sm w-full outline-none focus:bg-transparent active:bg-transparent"
            />
          </div>

          <div class="flex flex-col items-start gap-2 w-full">
            <p class="text-primary font-semibold">Gender</p>
            <q-select
              outlined
              class="w-full"
              v-model="gender"
              :options="genderOptions"
              label="Gender"
            >
            </q-select>
          </div>

          <div class="flex flex-col items-start gap-2 w-full">
            <p class="text-primary font-semibold">Amount</p>
            <q-input
              v-model="amount"
              outlined
              color="dark"
              bg-color="white"
              for="amount"
              placeholder="Amount"
              type="number"
              class="drop-shadow-sm w-full outline-none focus:bg-transparent active:bg-transparent"
            />
          </div>

          <div class="flex flex-col items-start gap-2 w-full">
            <p class="text-primary font-semibold">Leave Information</p>
            <q-input
              v-model="info"
              outlined
              color="dark"
              bg-color="white"
              for="info"
              @keydown.enter.prevent="create()"
              placeholder="Leave Information"
              class="drop-shadow-sm w-full outline-none focus:bg-transparent active:bg-transparent"
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
            @click="create()"
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
  emits: ['get-data'],

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
      leaveTitle: '',
      gender: '',
      genderOptions: ['L', 'P', 'LP'],
      amount: 0,
      info: '',
    };
  },
  props: {
    id: String,
  },
  components: {
    Icon,
  },

  methods: {
    async create() {
      await api
        .post(
          '/leave/special-leave/',
          {
            leaveTitle: this.leaveTitle,
            gender: this.gender,
            amount: this.amount,
            leaveInformation: this.info,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          this.successNotif(res.data.message);
          this.leaveTitle = '';
          this.gender = '';
          this.amount = '';
          this.info = '';
          this.dialog = false;

          this.$emit('get-data');
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.round {
  border-radius: 8px;
}
</style>
