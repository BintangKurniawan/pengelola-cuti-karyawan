<template>
  <div>
    <q-btn
      @click="dialog = true"
      label="Reject Leave"
      unelevated
      text-color="negative"
      class="font-bold round text-center capitalize px-4 mx-4 my-0 py-0 h-[21px]"
    />
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-full px-4 pb-4">
        <q-card-section>
          <h6 class="font-bold text-center text-xl">Reject Optional Leave</h6>
        </q-card-section>

        <q-card-section>
          <p class="text-center text-[#a0a0a0] font-semibold text-base">
            Are you sure want to reject this optional leave?
          </p>
          <div class="flex flex-col items-start mt-2 w-full">
            <q-input
              v-model="note"
              outlined
              color="dark"
              bg-color="white"
              for="note"
              placeholder="Note"
              @keydown.enter.prevent="reject(id)"
              class="drop-shadow-sm w-full outline-none focus:bg-transparent active:bg-transparent"
            />
          </div>
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
            @click="reject(id)"
            unelevated
            :disable="isTomorrow(date)"
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
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const $q = useQuasar();

    return {
      rejectNotif() {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: 'Optional leave rejected',
          color: 'primary',
          multiLine: true,
        });
      },
      errorNotif(msg) {
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
      note: '',
    };
  },
  props: {
    id: Number,
    date: String,
  },
  components: {
    Icon,
  },
  mounted() {
    console.log(this.isTomorrow());
    console.log(this.date);
  },
  methods: {
    // TO REJECT OPTIONAL LEAVE
    async reject(id) {
      await api
        .patch(`/leave/optional/${id}/reject`, { note: this.note })
        .then((resp) => {
          console.log(resp);
          this.dialog = false;
          this.rejectNotif();
          this.$emit('get-data');
          setInterval(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          if (err.response.data.message) {
            this.errorNotif(err.response.data.message);
          }
        });
    },
    isTomorrow(date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Menggunakan +1 karena kita ingin membandingkan dengan besok, bukan kemarin
      const givenDate = new Date(date);

      return givenDate < tomorrow;
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.round {
  background-color: #fbe7e8;
  border-radius: 8px;
}
</style>
