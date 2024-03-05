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
          <div class="flex justify-around items-end gap-9 w-full">
            <q-btn
              v-if="permissions.includes('Setting Website')"
              label="Web Config"
              unelevated
              @click="openConfig"
              color="primary"
              text-color="white"
              class="font-bold round text-center capitalize px-4 py-2"
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
            <q-toggle
              v-if="permissions.includes('Receiving Email Requests for Leave')"
              color="primary"
              v-model="emailNotif"
              label="Turn on email notification"
              @update:model-value="turnOnOffEmail"
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

    <q-dialog v-model="webconfig">
      <!-- <q-scroll-area style="height: 100%; width: 100%">
        <q-card class="bg-white w-full">
          

          
        </q-card>
      </q-scroll-area> -->

      <q-layout view="Lhh lpR fff" container class="bg-white text-dark">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title>Setting</q-toolbar-title>
            <q-btn flat @click="drawerR = !drawerR" round dense icon="menu" />
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-drawer
          side="right"
          bordered
          v-model="drawerR"
          :width="200"
          :breakpoint="300"
          class="text-dark"
        >
          <q-card-section>
            <div
              class="relative group transition-all md:w-fit flex items-center gap-1 cursor-pointer pb-1 md:justify-start text-2xl"
            >
              <span
                class="h-[2px] inline-block bg-primary absolute left-0 bottom-0.5 w-full transition-[width] ease duration-300"
                >&nbsp;</span
              >
              <p class="capitalize">Port Option</p>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="flex items-start gap-4">
              <q-input
                v-model="port"
                id="port"
                outlined
                color="dark"
                bg-color="white"
                label="Port"
                type="number"
                for="port"
                placeholder="9000"
              />
              <q-input
                v-model="gmail"
                id="gmail"
                outlined
                color="dark"
                bg-color="white"
                label="Gmail"
                for="gmail"
                placeholder="5XpUQ@example.com"
              />
              <q-input
                v-model="passUser"
                id="pass"
                outlined
                :type="showPw2 ? 'text' : 'password'"
                color="dark"
                bg-color="white"
                label="Password"
                for="passUser"
                placeholder="5XpUQ@example.com"
              >
                <template v-slot:append>
                  <Icon
                    :icon="showPw2 ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                    @click="showPw2 = !showPw2"
                    class="cursor-pointer text-secondary"
                  />
                </template>
              </q-input>
              <p class="italic underline cursor-pointer">How to get password</p>
              <q-btn
                label="Save"
                class="capitalize"
                color="primary"
                @click="savePort"
              />
            </div>
          </q-card-section>
        </q-drawer>

        <q-page-container>
          <q-card-section>
            <div
              class="relative group transition-all md:w-fit flex items-center gap-1 cursor-pointer pb-1 md:justify-start text-2xl"
            >
              <span
                class="h-[2px] inline-block bg-primary absolute left-0 bottom-0.5 w-full transition-[width] ease duration-300"
                >&nbsp;</span
              >
              <p class="capitalize">Color Option</p>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="flex items-start gap-4 p-4">
              <q-color
                v-model="hex"
                no-header-tabs
                no-footer
                class="my-picker w-[276px]"
                flat
              />
              <q-btn
                label="Save"
                class="capitalize"
                color="primary"
                @click="saveColor"
              />
            </div>
          </q-card-section>

          <q-card-section>
            <div
              class="relative group transition-all md:w-fit flex items-center gap-1 cursor-pointer pb-1 md:justify-start text-2xl"
            >
              <span
                class="h-[2px] inline-block bg-primary absolute left-0 bottom-0.5 w-full transition-[width] ease duration-300"
                >&nbsp;</span
              >
              <p class="capitalize">Logo</p>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="flex flex-row gap-4 p-4">
              <div class="flex items-center flex-col justify-center">
                <q-file
                  v-model="img"
                  accept="image/*"
                  max-files="1"
                  label="Click to Upload"
                  type="file"
                  filled
                  @update:model-value="handleUpload()"
                  class="w-[276px]"
                />
                <q-img :src="imgURL" class="w-[276px] h-auto" />
              </div>
              <div>
                <q-btn
                  label="Save"
                  class="capitalize"
                  color="primary"
                  @click="saveImg"
                />
              </div>
            </div>
          </q-card-section>
        </q-page-container>
      </q-layout>
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
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import api from 'src/AxiosInterceptors';
import { setCssVar, useQuasar } from 'quasar';
import { useConfigPortStore } from 'src/stores/configStore';

export default {
  setup() {
    const $q = useQuasar();
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    const imgURL = ref('');
    const img = ref(null);
    const handleUpload = () => {
      console.log('handleUpload is triggered');
      if (img.value) {
        imgURL.value = URL.createObjectURL(img.value);
      }
    };
    const store = useConfigPortStore();
    return {
      store,
      port: '',
      gmail: '',
      passUser: '',
      hex: ref(),
      img,
      imgURL,
      handleUpload,
      permissions,
      drawerR: ref(false),
      showPw: ref(false),
      showPw2: ref(false),
      successNotif(msg: any) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'primary',
          multiLine: true,
        });
      },
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
      webconfig: ref(false),
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
    openConfig() {
      this.getSetting();
      this.webconfig = true;
    },
    //  TO GET POSITION ID
    // getId(name: any) {
    //   const typePosition = this.typePositionOptions.find(
    //     (option: { label: any }) => option.label === name
    //   );
    //   return typePosition ? typePosition.value : null;
    // },
    // TO GET ROLE ID
    // getRoleId(role: any) {
    //   const roleType = this.roleTypeOptions.find(
    //     (option: { label: any }) => option.label === role
    //   );

    //   return roleType ? roleType.value : null;
    // },
    formatDate(dateString: {
      split: (arg0: string) => {
        (): any;
        new (): any;
        map: { (arg0: NumberConstructor): [any, any, any]; new (): any };
      };
    }) {
      const [day, month, year] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-UK', options);
    },

    //  TO GET LOGGED IN USER DATA
    async getData() {
      await api
        .get(`/employee/detail/${this.nik}`)
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

      if (this.permissions.includes('Receiving Email Requests for Leave')) {
        await api
          .get('/leave/receive-email')
          .then((res) => {
            console.log(res);
            this.emailNotif = res.data.data.receiveEmail;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    async turnOnOffEmail() {
      await api
        .patch('/leave/receive-email')
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
        .post('/employee/change-password', { newPassword: this.password })
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
        .patch(
          `/employee/update-name/${this.nik}`,
          {
            name: this.name,
          },
          {
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

    async getSetting() {
      await api
        .get('/webSetting')
        .then((res) => {
          const setting = res.data.data[0];

          this.hex = setting.webColorCode;
          this.imgURL = setting.picture;
          localStorage.setItem('logo', setting.picture);
        })
        .catch((err) => {
          console.error(err);
        });

      await api
        .get('/webSetting/config')
        .then((res) => {
          this.port = res.data.PORT;
          this.gmail = res.data.GMAIL_USER;
          this.passUser = res.data.GMAIL_PASSWORD;
          this.store.setPort(this.port);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async saveColor() {
      await api
        .put('/siteSetting/update-color/1', { colorCode: this.hex })
        .then((res) => {
          console.log(res);
          localStorage.setItem('color', this.hex);
          setCssVar('primary', this.hex);
          this.successNotif(res.data.message);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },

    async saveImg() {
      await api
        .patch(
          '/siteSetting/update-image/1',
          { picture: this.img },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then((res) => {
          console.log(res);
          localStorage.setItem('logo', res.data.data.picture);
          this.successNotif(res.data.message);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },

    async savePort() {
      await api
        .put('/webSetting/update-config', {
          PORT: this.port,
          GMAIL_USER: this.gmail,
          GMAIL_PASSWORD: this.passUser,
        })
        .then((res) => {
          // JSON.stringify(localStorage.setItem('port', this.port));

          console.log(res);
          this.store.setPort(this.port);
          // this.store.setConfig(this.port);
          this.successNotif(res.data.message);
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
