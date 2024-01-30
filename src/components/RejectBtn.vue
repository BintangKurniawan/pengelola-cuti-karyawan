<template>
  <q-btn flat text-color="white" class="px-0" @click="dialog = true">
    <Icon icon="mdi:close-circle-outline" width="24" class="text-negative" />
  </q-btn>

  <div>
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-full px-4 pb-4">
        <q-card-section>
          <h6 class="font-bold text-center text-xl">Reject Request</h6>
        </q-card-section>

        <q-card-section>
          <p class="text-center text-[#a0a0a0] font-semibold text-base">
            Are you sure want to reject this leave?
          </p>
          <div class="flex flex-col items-start mt-2 w-full">
            <q-input
              v-model="note"
              outlined
              color="dark"
              bg-color="white"
              for="note"
              placeholder="Note"
              @keydown.enter.prevent="reject(type.toLowerCase(), id)"
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
            unelevated
            @click="reject(type.toLowerCase(), id)"
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
      note: '',
    };
  },

  components: {
    Icon,
  },
  props: {
    type: String,
    id: Number,
  },
  methods: {
    acc(id, type) {
      console.log(id);
      console.log(type);
    },

    // TO REJECT LEAVE IN LISTPAGE
    async reject(type, id) {
      await api
        .patch(
          `/leave/${type}/${id}/reject`,
          { note: this.note },
          { withCredentials: true }
        )
        .then((resp) => {
          console.log(resp);
          this.dialog = false;
          this.successNotif(resp.data.message);
          setInterval(() => {
            document.location.reload();
          }, 2000);
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
  background-color: #fbe7e8;
  border-radius: 8px;
}
</style>
