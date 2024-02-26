<template>
  <q-btn
    color="primary"
    text-color="white"
    class="capitalize rounded-3xl"
    @click="dialog = true"
  >
    <div class="flex items-center justify-center gap-1">
      <p>Send Email</p>
    </div>
  </q-btn>

  <div>
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-[30%]">
        <q-card-section>
          <h6 class="font-bold text-center">Send Email</h6>
        </q-card-section>

        <q-card-section>
          <p class="text-center text-[#a0a0a0]">
            Are you sure want to send email?
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
            label="Send"
            :loading="load"
            unelevated
            @click="sendEmail(type, id)"
            color="primary"
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
import { onBeforeUnmount } from 'vue';
export default {
  emits: ['get-data'],

  setup() {
    const $q = useQuasar();
    let timer;
    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });
    return {
      showLoading() {
        $q.loading.show();
        timer = setTimeout(() => {
          $q.loading.hide();
          timer = void 0;
        }, 1500);
      },
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
      load: false,
    };
  },
  props: {
    id: String,
    type: String,
  },
  components: {
    Icon,
  },
  methods: {
    // TO DISABLE ACCOUNT WHEN EMPLOYEE RESIGN
    sendEmail(type, id) {
      this.showLoading();
      this.load = true;
      api
        .post(`/leave/send-leave-email/${type}/${id}`, {
          withCredentials: true,
        })
        .then((resp) => {
          this.successNotif(resp.data.message);
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
