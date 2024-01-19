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
            @click="approve(id)"
            text-color="positive"
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
          message: 'Leave has been successfully approved',
          color: 'primary',
          multiLine: true,
          actions: [
            {
              label: 'Refresh',
              color: 'white',
              handler: () => {
                document.location.reload();
              },
            },
          ],
        });
      },
      failedNotif() {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: 'Failed to approve leave',
          color: 'negative',
          multiLine: true,
          actions: [
            {
              label: 'Refresh',
              color: 'white',
              handler: () => {
                document.location.reload();
              },
            },
          ],
        });
      },
    };
  },
  data() {
    return {
      dialog: ref(false),
    };
  },

  components: {
    Icon,
  },
  props: {
    id: Number,
  },
  methods: {
    async approve(id) {
      await api
        .patch(`/leave/personal/${id}/approve`, {}, { withCredentials: true })
        .then((resp) => {
          console.log(resp);
          this.dialog = false;
          this.successNotif();
        })
        .catch((err) => {
          console.error(err);
          this.failedNotif();
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
