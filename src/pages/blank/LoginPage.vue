<template>
  <q-page class="flex justify-center gap-16 flex-col items-center text-center">
    <q-img
      src="../../assets/img/logo_wgs_fullBlack.svg"
      class="w-[276px] h-[62px]"
    />

    <div class="flex flex-col gap-8 items-center">
      <q-input
        rounded
        v-model="email"
        outlined
        color="dark"
        bg-color="white"
        label="Email"
        for="email"
        placeholder="Email"
        class="md:w-80 w-60 drop-shadow-sm outline-none focus:bg-transparent active:bg-transparent"
      />

      <q-input
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

      <q-btn
        text-color="white"
        unelevated
        size="md"
        rounded
        @click="login"
        padding="sm"
        color="primary"
        label="login"
        :loading="loading"
        class="px-[88px] py-4 w-60 text-2xl items-center text-bold"
      >
      </q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue';
import { Cookies } from 'quasar';
import api from 'src/AxiosInterceptors';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
export default {
  components: {
    Icon,
  },
  setup() {
    const $q = useQuasar();
    const route = useRouter();
    return {
      route,
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
      failedNotif(msg: any) {
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
    return {
      email: '',
      password: '',
      passwordFieldType: 'password',
      response: [],
      role: '',
    };
  },
  methods: {
    async login() {
      this.loading = true;

      await api
        .post(
          '/auth/login',
          { email: this.email, password: this.password },
          { withCredentials: true }
        )
        .then((resp) => {
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
          if (this.role !== '2' && this.role !== '1') {
            this.$router.push('/');
          } else {
            this.$router.push('/admin/dashboard');
          }
          this.successNotif();
        })
        .catch((error) => {
          if (error.response) {
            const msg = error.response.data.message;
            this.failedNotif(msg);
          }
        });

      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
