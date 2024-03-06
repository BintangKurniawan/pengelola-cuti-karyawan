<template>
  <q-btn flat text-color="white" class="px-0" @click="dialog = true">
    <Icon icon="mdi:check-circle-outline" width="24" class="text-info" />
  </q-btn>

  <div>
    <q-dialog v-model="dialog">
      <q-card class="bg-white">
        <q-card-section>
          <h6 class="font-bold text-center">Accept Request</h6>
        </q-card-section>

        <q-card-section>
          <p class="text-center text-[#a0a0a0]">
            Are you sure want to accept this request leave?
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
            label="Accept"
            unelevated
            :loading="loading"
            @click="approve(type, id)"
            text-color="positive"
            class="font-bold round text-center capitalize px-10 py-2"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { onBeforeUnmount, ref } from 'vue';
import { Icon } from '@iconify/vue';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const $q = useQuasar();

    return {
      showLoading() {
        $q.loading.show();
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
      loading: ref(false),
    };
  },

  components: {
    Icon,
  },
  props: {
    id: Number,
    type: String,
  },
  methods: {
    // TO APPROVE LEAVE IN LIST PAGE
    async approve(type, id) {
      this.showLoading();
      this.loading = true;
      await api
        .patch(`/leave/${type}/${id}/approve`, {})
        .then((resp) => {
          console.log(resp);
          this.dialog = false;
          this.successNotif(resp.data.message);
          setInterval(() => {
            window.location.reload();
            if (type === 'personal') {
              this.$router.push('/admin/list-leave?type=Ordinary');
            } else {
              this.$router.push('/admin/list-leave?type=Special');
            }
          }, 1500);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
            this.$q.loading.hide();
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.round {
  background-color: #ebf9f1;
  border-radius: 8px;
}
</style>
