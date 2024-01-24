<template>
  <div>
    <q-btn
      dense
      flat
      class="flex items-start w-full md:w-fit hover:bg-gray-100 p-4"
      @click="dialog = true"
    >
      <div class="flex items-center gap-4">
        <Icon icon="mdi:cog-outline" width="24" />
        <p class="capitalize">Setting</p>
      </div>
    </q-btn>
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-full">
        <q-card-section>
          <h6 class="font-bold text-center">Settings</h6>
        </q-card-section>

        <q-card-section class="flex items-center gap-4 w-full justify-between">
          <div class="flex justify-around items-end gap-2 w-full">
            <div class="flex flex-col items-start gap-1">
              <p class="text-primary font-semibold">Name</p>
              <q-input
                v-model="name"
                outlined
                color="dark"
                bg-color="white"
                for="name"
                label="Name"
                class="drop-shadow-sm w-44 outline-none focus:bg-transparent active:bg-transparent"
              />
            </div>

            <q-btn
              label="Save Change"
              unelevated
              @click="editName"
              text-color="positive"
              class="font-bold round text-center capitalize px-4 py-2"
            />
          </div>
          <div class="flex justify-around items-end gap-5 w-full">
            <div class="flex flex-col items-start gap-1">
              <p class="text-primary font-semibold">Password</p>
              <q-input
                v-model="password"
                outlined
                color="dark"
                bg-color="white"
                label="Password"
                :type="showPw ? 'text' : 'password'"
                for="password"
                placeholder="Password"
                class="w-44 drop-shadow-sm outline-none focus:bg-transparent active:bg-transparent"
              >
                <template v-slot:append>
                  <Icon
                    :icon="showPw ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                    @click="showPw = !showPw"
                    class="cursor-pointer text-secondary"
                  /> </template
              ></q-input>
            </div>

            <q-btn
              @click="modal = true"
              label="Change"
              unelevated
              color="primary"
              text-color="white"
              class="font-bold round text-center capitalize px-4 py-2 w-[120px]"
            />
          </div>
          <q-card-section
            class="flex items-center gap-4 w-full justify-between"
          >
            <div
              class="text-secondary rounded-lg flex items-center gap-2 cursor-pointer"
              @click="dialog = false"
            >
              <Icon icon="mdi:arrow-collapse-left" size="24" />
              Back
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modal">
      <q-card class="bg-white">
        <q-card-section>
          <h6 class="font-bold text-center">Change Password</h6>
        </q-card-section>

        <q-card-section>
          <p class="text-center text-[#a0a0a0]">
            Are you sure want to change your password?
          </p>
        </q-card-section>

        <q-card-section class="flex items-center gap-4 w-full justify-between">
          <div
            class="text-secondary rounded-lg flex items-center gap-2 cursor-pointer"
            @click="modal = false"
          >
            <Icon icon="mdi:arrow-collapse-left" size="24" />
            Back
          </div>
          <q-btn
            label="Yes"
            @click="changePassword"
            unelevated
            text-color="positive"
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
      showPw: ref(false),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      successNotif(msg: any) {
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
    const nik = localStorage.getItem('nik');

    return {
      dialog: ref(false),
      modal: ref(false),
      name: '',
      password: '',
      nik,
      exp: '',

      // typeContract: {} as { status: boolean; label: string },
      // typeContractOptions: [
      //   { status: false, label: 'Permanent' },
      //   { status: true, label: 'Contract' },
      // ],
      contractBoolean: false,

      // typePosition: {} as { value: number; label: string },
      // FOR POSITION DATA
      typePositionOptions: [],
      // FOR POSITION ID
      positionId: '',

      // contractType: null,
      // contractTypeOptions: [
      //   { value: false, label: 'Old Employee' },
      //   { value: true, label: 'New Employee' },
      // ],

      // roleType: null,
      roleTypeOptions: [
        { value: 2, label: 'Admin' },
        { value: 3, label: 'User' },
      ],
      role: 3,
    };
  },
  components: {
    Icon,
  },
  async mounted() {
    await this.getPosition();
    await this.getData();
  },
  methods: {
    //  TO GET POSITION ID
    getId(name: any) {
      const typePosition = this.typePositionOptions.find(
        (option) => option.label === name
      );
      return typePosition ? typePosition.value : null;
    },
    // TO GET ROLE ID
    getRoleId(role: any) {
      const roleTypeOptions = this.roleTypeOptions.find(
        (option) => option.label === role
      );

      return roleTypeOptions ? roleTypeOptions.value : null;
    },
    // TO GET POSITION
    async getPosition() {
      await api
        .get('/position', { withCredentials: true })
        .then((resp) => {
          const positions = resp.data.data;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedPositions = positions.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (position: { id: any; name: any }) => {
              return {
                value: position.id,
                label: position.name,
              };
            }
          );

          this.typePositionOptions = mappedPositions;
          console.log(this.typePositionOptions);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
    //  TO GET LOGGED IN USER DATA
    async getData() {
      await api
        .get(`/employee/detail/${this.nik}`, { withCredentials: true })
        .then((resp) => {
          console.log(resp);
          this.name = resp.data.data[0].name;
          this.positionId = this.getId(resp.data.data[0].positions.name);
          this.contractBoolean = resp.data.data[0].typeOfEmployee.isContract;

          this.role = this.getRoleId(resp.data.data[0].user.role.name);
          if (resp.data.data[0].typeOfEmployee.endContract) {
            this.exp = resp.data.data[0].typeOfEmployee.endContract;
          }
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },

    // FOR CHANGE PASSWORD
    async changePassword() {
      await api
        .post(
          '/employee/change-password',
          { newPassword: this.password },
          { withCredentials: true }
        )
        .then((resp) => {
          console.log(resp);
          const msg = resp.data.message;
          this.successNotif(msg);
          this.dialog = false;
          this.modal = false;
          localStorage.setItem('firstLogin', 'false');
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
    // FOR EDIT NAME
    async editName() {
      await api
        .put(
          `/employee/update/${this.nik}`,
          {
            name: this.name,
            positionId: this.positionId,
            typeOfEmployee: {
              isContract: this.contractBoolean,
              endContract: this.exp,
            },
            roleId: this.role,
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
          console.log(resp);
          const msg = resp.data.message;
          this.successNotif(msg);
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
  background-color: #ebf9f1;
  border-radius: 8px;
}
</style>
