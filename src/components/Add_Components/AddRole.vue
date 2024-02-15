<template>
  <div>
    <q-btn
      color="primary"
      text-color="white"
      class="capitalize rounded-3xl"
      @click="openDialog"
    >
      <div class="flex items-center justify-center gap-1">
        <Icon icon="mdi:account-plus-outline" size="24" />
        <p>Add Role</p>
      </div>
    </q-btn>
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-full">
        <q-card-section>
          <h6 class="font-bold text-center">Add Role</h6>
        </q-card-section>

        <q-card-section class="flex items-center gap-4 w-full justify-between">
          <div class="w-full">
            <div class="flex flex-col items-start gap-1 w-[45%]">
              <p class="text-primary font-semibold">Role Name</p>
              <q-input
                v-model="name"
                outlined
                color="dark"
                bg-color="white"
                for="name"
                placeholder="Name"
                class="drop-shadow-sm w-full outline-none focus:bg-transparent active:bg-transparent"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="w-fit overflow-scroll">
          <p class="text-primary font-semibold">Permission</p>
          <div
            class="flex flex-wrap flex-row justify-start items-start w-full gap-1 h-[200px]"
          >
            <div class="flex flex-wrap">
              <div
                v-for="(data, index) in roleOptions"
                v-bind:key="index"
                style="flex: 1 1 50%"
              >
                <q-checkbox
                  size="sm"
                  v-model="selectedRole"
                  :val="data.value"
                  :label="data.label"
                />
              </div>
            </div>
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
            label="Confirm"
            color="primary"
            unelevated
            @click="addRole"
            text-color="white"
            class="font-bold round text-center capitalize px-10 py-2"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const $q = useQuasar();
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addNotif(msg: any) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'primary',
          multiLine: true,
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      failedNotif(msg: any) {
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
      name: '',
      dialog: ref(false),

      // FOR SELECT IN Q-SELECT, THE DATA IS GAINED FROM API
      roleOptions: [],

      selectedRole: ref([]),
    };
  },
  props: {
    id: Number,
  },
  components: {
    Icon,
  },

  methods: {
    openDialog() {
      this.dialog = true;
      this.getRole();
    },
    // TO GET POSITION
    async getRole() {
      await api
        .get('/role/permissions?page=1&perPage=100', { withCredentials: true })
        .then((resp) => {
          const roles = resp.data.data;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedRoles = roles.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (role: { id: any; name: any }) => {
              return {
                value: role.id,
                label: role.name,
              };
            }
          );

          this.roleOptions = mappedRoles;
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
    // TO ADD EMPLOYEE
    async addRole() {
      await api
        .post(
          '/role/create',
          {
            name: this.name,
            permissions: this.selectedRole,
          },
          {
            withCredentials: true,
            headers: {
              Accept: '*/*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then((resp) => {
          this.addNotif(resp.data.message);
          console.log(resp);
          // CLEAR DATA

          this.dialog = false;
          this.name = '';

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
