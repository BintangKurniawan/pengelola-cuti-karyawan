<template>
  <q-page class="flex justify-center gap-16 flex-col items-center text-center">
    <q-img :src="img" class="w-[276px] h-auto" fetchpriority="low" v-if="img" />
    <q-img
      v-else
      src="../../assets/img/logo_vimarcha.png"
      class="w-[276px] h-auto"
    />

    <div class="flex flex-col gap-8 items-center">
      <q-input
        id="email"
        rounded
        v-model="email"
        outlined
        autofocus
        color="dark"
        bg-color="white"
        label="Email"
        for="email"
        placeholder="Email"
        class="md:w-80 w-60 drop-shadow-sm outline-none focus:bg-transparent active:bg-transparent"
      />

      <q-input
        id="pw"
        rounded
        v-model="password"
        outlined
        color="dark"
        bg-color="white"
        label="Password"
        :type="showPw ? 'text' : 'password'"
        for="password"
        placeholder="Password"
        @keydown.enter.prevent="login"
        class="md:w-80 w-60 drop-shadow-sm outline-none focus:bg-transparent active:bg-transparent"
      >
        <template v-slot:append>
          <Icon
            :icon="showPw ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
            @click="showPw = !showPw"
            class="cursor-pointer text-secondary"
          /> </template
      ></q-input>

      <q-input v-model="PORT" @update:model-value="setPort" />

      <q-btn
        v-if="isFetched"
        id="login"
        text-color="white"
        unelevated
        size="md"
        rounded
        @click="login"
        padding="sm"
        label="login"
        :loading="loading"
        class="px-[88px] py-4 w-60 text-2xl items-center text-bold"
        :style="{ backgroundColor: isFetched ? color : 'initial' }"
      >
      </q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue';
import api from 'src/AxiosInterceptors';
import { ref } from 'vue';
import { colors, getCssVar, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { onBeforeUnmount } from 'vue';
import { setCssVar } from 'quasar';
import { useColorStore } from 'src/stores/colorStore';
import { publicIpv4 } from 'public-ip';
import os from 'os';
import { networkInterfaces } from 'os';
import config from 'dotenv';
export default {
  components: {
    Icon,
  },
  setup() {
    // FOR LOADING
    const $q = useQuasar();
    const store = useColorStore();
    const route = useRouter();
    setCssVar('primary', `${localStorage.getItem('color')}`);
    let timer: string | number | NodeJS.Timeout | undefined;
    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });

    const nwIf = networkInterfaces;
    let ipAddress;

    for (const interfaceKey in nwIf) {
      const networkInterface = nwIf[interfaceKey];
      for (let i = 0; i < networkInterface.length; i++) {
        const iface = networkInterface[i];
        if (!iface.internal && iface.family === 'IPv4') {
          ipAddress = iface.address;
          break;
        }
      }
      if (ipAddress) {
        break;
      }
    }
    console.log(ipAddress);

    return {
      store,
      route,
      showLoading() {
        $q.loading.show();
        timer = setTimeout(() => {
          $q.loading.hide();
          timer = void 0;
        }, 1500);
      },
      successNotif() {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: 'Login success',
          color: 'primary',
          multiLine: true,
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      failedNotif(msg: any, color: any) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'negative',
          multiLine: true,
        });
      },
      loading: ref(false),
      showPw: ref(false),
    };
  },
  data() {
    const bgColor = localStorage.getItem('bgcolor');

    return {
      bgColor,
      PORT: '',
      kakang: '',
      email: '',
      password: '',
      passwordFieldType: 'password',
      response: [],
      role: '',
      img: '',
      color: '',

      isFetched: false,
    };
  },
  mounted() {
    this.getSetting();
    // console.log(getCssVar('--q-primary'));
    setCssVar('primary', `${localStorage.getItem('color')}`);
    this.kknjt();
    console.log(location.host);
    config.configDotenv;
    console.log(process.env.port);
    this.PORT = process.env.port;
  },
  methods: {
    setPort() {
      process.env.port = this.PORT;
      console.log('tes');

      fetch('.env.test', {
        method: 'PUT',
        body: `VUE_APP_PORT=${this.PORT}`,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
        .then(() => {
          console.log('saved');
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async kknjt() {
      console.log(await publicIpv4());
    },
    async getSetting() {
      await api
        .get('/webSetting')
        .then((res) => {
          const setting = res.data.data[0];

          this.img = setting.picture;
          this.color = setting.webColorCode;
          console.log(this.color);
          localStorage.setItem('color', this.color);
          localStorage.setItem('logo', this.img);
          setCssVar('--q-primary', `${this.color}`);
          setCssVar('primary', this.color);
          console.log(setting);

          this.store.setColor(this.color);
          // setTimeout(() => {
          // }, 2000);
          this.isFetched = true;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // TO GET POSITION AND SAVE IT TO LOCALSTORAGE. IDK WILL I USE THIS AGAIN OR NO
    getPosition() {
      api
        .get('/position?page=1&perPage=100')
        .then((res) => {
          const position = res.data.data;
          const positionDataString = JSON.stringify(position);
          localStorage.setItem('position', positionDataString);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    // TO GET USER LOGIN DATA AND SAVE IT INTO LOCAL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getLoginData(nik: any) {
      api
        .get(`/employee/detail/${nik}`)
        .then((res) => {
          const userData = res.data.data;
          const userDataString = JSON.stringify(userData);
          localStorage.setItem('userData', userDataString);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getPermission(roleId: any) {
      api
        .get(`/role/${roleId}`)
        .then((res) => {
          const permission = res.data.data.rolePermissions.map(
            (permission: { permission: { name: any } }) =>
              permission.permission.name
          );

          localStorage.setItem('permissions', JSON.stringify(permission));
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async login() {
      this.loading = true;
      await api
        .post('/auth/login', { email: this.email, password: this.password })
        .then((resp) => {
          this.showLoading();

          this.response = resp.data.data;
          this.role = resp.data.data.user.roleId;
          const token = resp.data.data.accessToken;
          this.email = '';
          this.password = '';
          console.log(resp.status);

          localStorage.setItem('firstLogin', resp.data.data.user.isFirst);
          localStorage.setItem('nik', resp.data.data.employee.nik);
          // const refreshToken = Cookies.get('refreshToken');
          // const refreshToken = resp.data.data.encryptedRefreshToken;

          // Cookies.set('refreshToken', refreshToken);
          // Cookies.set('accessToken', token);
          localStorage.setItem('token', token);
          localStorage.setItem('role', this.role);
          console.log(this.role);

          this.getPosition();
          this.getLoginData(resp.data.data.employee.nik);
          this.getPermission(resp.data.data.user.roleId);

          setInterval(() => {
            window.location.reload();
          }, 1500);
          this.successNotif();
        })
        .catch((error) => {
          if (error.response) {
            const msg = error.response.data.message;
            this.failedNotif(msg, this.color);
          }
        });

      this.loading = false;
    },
  },
};
</script>

<style></style>
