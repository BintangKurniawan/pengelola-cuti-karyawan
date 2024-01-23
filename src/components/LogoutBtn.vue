<template>
  <div>
    <q-btn
      dense
      flat
      class="flex items-start w-full md:w-fit hover:bg-gray-100 p-4"
      @click="dialog = true"
    >
      <div class="flex items-center gap-4">
        <Icon icon="mdi:logout" width="24" />
        <p class="capitalize">Logout</p>
      </div>
    </q-btn>
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-[90%]">
        <q-card-section>
          <h6 class="font-bold text-center">Logout</h6>
        </q-card-section>

        <q-card-section>
          <p class="text-center text-[#a0a0a0]">Are you sure want to logout?</p>
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
            @click="logout"
            label="Logout"
            unelevated
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
import { Cookies } from 'quasar';
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
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
    };
  },
  components: {
    Icon,
  },

  methods: {
    async logout() {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const refreshToken = Cookies.get('refreshToken');

      try {
        await api
          .get('/auth/logout', { withCredentials: true })
          .then((resp) => {
            console.log(resp);
            localStorage.removeItem('role');
            localStorage.removeItem('nik');
            localStorage.removeItem('token');
            const msg = resp.data.message;
            this.successNotif(msg);
            this.$router.push('/login');
          });
      } catch (err) {
        if (err.response) {
          const msg = err.response.data.message;
          this.failedNotif(msg);
        }
      }
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
