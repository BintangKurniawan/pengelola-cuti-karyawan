<template>
  <div>
    <q-btn
      dense
      flat
      class="flex items-start w-full hover:bg-gray-100 p-4"
      @click="openDialog"
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
                @keydown.enter.prevent="save"
                label="Name"
                class="drop-shadow-sm w-44 outline-none focus:bg-transparent active:bg-transparent"
              />
            </div>

            <q-btn
              label="Save Change"
              unelevated
              @click="save"
              text-color="positive"
              class="font-bold round text-center capitalize px-4 py-2"
            />
          </div>
          <div class="flex justify-around items-end gap-5 w-full">
            <q-toggle
              color="primary"
              v-model="emailNotif"
              label="Turn on email notification"
              @update:model-value="turnOnOffEmail"
            />
            <q-btn
              label="Change Password"
              unelevated
              @click="changepw = true"
              color="primary"
              text-color="white"
              class="font-bold round text-center capitalize px-4 py-2"
            />
          </div>
          <div class="flex items-center gap-4 w-full justify-between">
            <div
              class="text-secondary rounded-lg flex items-center gap-2 cursor-pointer"
              @click="dialog = false"
            >
              <Icon icon="mdi:arrow-collapse-left" size="24" />
              Back
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="changepw">
      <q-card class="bg-white w-[30%]">
        <q-card-section class="flex items-center gap-4 w-full justify-between">
          <div class="flex flex-col items-start gap-1 w-full">
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
              class="w-full drop-shadow-sm outline-none focus:bg-transparent active:bg-transparent"
            >
              <template v-slot:append>
                <Icon
                  :icon="showPw ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                  @click="showPw = !showPw"
                  class="cursor-pointer text-secondary"
                /> </template
            ></q-input>
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn
            @click="modal = true"
            label="Change"
            unelevated
            color="primary"
            :disable="password.length < 6"
            text-color="white"
            class="font-bold round text-center capitalize px-4 py-2 w-[120px]"
          />
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
        });
      },
    };
  },
  data() {
    const nik = localStorage.getItem('nik');

    return {
      dialog: ref(false),
      modal: ref(false),
      changepw: ref(false),
      emailNotif: ref(),
      name: '',
      password: '',
      nik,
      exp: '',
      pwErr: '',
      shadow: true,

      contractBoolean: null,

      // FOR POSITION DATA
      typePositionOptions: [],
      // FOR POSITION ID
      positionId: 0,

      role: 0,
      contract: null,
      gender: '',
    };
  },
  components: {
    Icon,
  },
  async mounted() {
    // this.getData();
  },
  methods: {
    openDialog() {
      // this.getPosition();
      this.getData();
      this.dialog = true;
    },
    //  TO GET POSITION ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // getId(name: any) {
    //   const typePosition = this.typePositionOptions.find(
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     (option: { label: any }) => option.label === name
    //   );
    //   return typePosition ? typePosition.value : null;
    // },
    // TO GET ROLE ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // getRoleId(role: any) {
    //   const roleType = this.roleTypeOptions.find(
    //     (option: { label: any }) => option.label === role
    //   );

    //   return roleType ? roleType.value : null;
    // },
    formatDate(dateString: {
      split: (arg0: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map: { (arg0: NumberConstructor): [any, any, any]; new (): any };
      };
    }) {
      const [day, month, year] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-UK', options);
    },
    // TO GET POSITION
    async getPosition() {
      await api
        .get('/position?page=1&perPage=100', { withCredentials: true })
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
          const positionDataString = JSON.stringify(positions);
          localStorage.setItem('position', positionDataString);
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
          // console.log(resp);
          this.name = resp.data.data[0].name;
          this.positionId = resp.data.data[0].positions.id;
          this.contractBoolean = resp.data.data[0].typeOfEmployee.isContract;
          this.contract = resp.data.data[0].typeOfEmployee.newContract;
          this.gender = resp.data.data[0].gender;
          this.role = resp.data.data[0].user.role.id;
          if (resp.data.data[0].typeOfEmployee.endContract) {
            this.exp = this.formatDate(
              resp.data.data[0].typeOfEmployee.endContract
            );
          }
          const userData = resp.data.data;
          const userDataString = JSON.stringify(userData);
          localStorage.setItem('userData', userDataString);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
            document.location.reload();
          }
        });

      await api
        .get('/leave/receive-email', { withCredentials: true })
        .then((res) => {
          console.log(res);
          this.emailNotif = res.data.data.receiveEmail;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async turnOnOffEmail() {
      await api
        .patch('/leave/receive-email', {}, { withCredentials: true })
        .then((res) => {
          if (res.data.message) {
            this.successNotif(res.data.message);
          }
        })
        .catch((err) => {
          console.error(err);
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
          setInterval(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
    // FOR EDIT NAME
    async save() {
      await api
        .put(
          `/employee/update/${this.nik}`,
          {
            name: this.name,
            positionId: this.positionId,
            gender: this.gender,
            typeOfEmployee: {
              newContract: this.contract,
              endContract: this.exp,
              isContract: this.contractBoolean,
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
          this.getData();
          setInterval(() => {
            document.location.reload();
          }, 1500);
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
.notallow {
  pointer-events: none;

  cursor: not-allowed;
}
</style>
