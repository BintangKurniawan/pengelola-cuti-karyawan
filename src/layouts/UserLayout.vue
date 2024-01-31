<script lang="ts">
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import Logout from 'src/components/LogoutBtn.vue';
import Setting from 'src/components/SettingBtn.vue';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const role = localStorage.getItem('role');
    const $q = useQuasar();
    return {
      role,
      route: useRoute(),
      router: useRouter(),
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
    };
  },
  data() {
    const isFirst = localStorage.getItem('firstLogin');
    return {
      nav: false,
      name: '',
      leaveNow: 0,
      leaveThen: 0,
      amountLeaveCount: 1,
      isFirst,
    };
  },
  async mounted() {
    await this.getData();
    console.log(this.isFirst);
  },
  methods: {
    showNav() {
      this.nav = !this.nav;
    },
    async getData() {
      const date = new Date();
      const thisYear = date.getFullYear();

      await api
        .get('/employee/me', { withCredentials: true })
        .then((resp) => {
          console.log(resp);
          this.name = resp.data.data.name;
          if (resp.data.data.amountOfLeave[0].year === thisYear) {
            this.leaveNow = resp.data.data.amountOfLeave[0].amount;
            this.leaveThen = resp.data.data.amountOfLeave[1].amount;
          } else {
            this.leaveNow = resp.data.data.amountOfLeave[1].amount;
            this.leaveThen = resp.data.data.amountOfLeave[0].amount;
          }

          this.amountLeaveCount = resp.data.data.amountOfLeave.length;

          localStorage.setItem('nik', resp.data.data.employee.nik);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
  },
  components: {
    Icon,
    Logout,
    Setting,
  },
};
</script>

<template>
  <q-layout view="lHh lpR fFf">
    <q-header reveal class="bg-white text-black">
      <q-toolbar class="flex justify-between p-4 items-center">
        <q-img
          src="../assets/img/logo_wgs_fullBlack.svg"
          class="w-[130px] h-[29px]"
        />

        <div class="md:hidden">
          <q-btn dense flat class="" @click="showNav">
            <Icon icon="mdi:menu" width="24" />
          </q-btn>
        </div>

        <div class="md:flex hid">
          <q-btn
            v-if="role != '3'"
            dense
            flat
            href="/admin/dashboard"
            class="flex items-start w-full md:w-fit hover:bg-gray-100 p-4"
          >
            <div class="flex items-center gap-4">
              <Icon icon="mdi:view-dashboard-outline" width="24" />
              <p class="capitalize">Dashboard</p>
            </div>
          </q-btn>
          <Setting />
          <Logout />
        </div>
      </q-toolbar>

      <q-toolbar class="transition-all absolute" v-if="nav">
        <div class="w-full bg-white h-[150x]">
          <q-btn
            v-if="role !== '3'"
            dense
            flat
            href="/admin/dashboard"
            class="flex items-start w-full md:w-fit hover:bg-gray-100 p-4"
          >
            <div class="flex items-center gap-4">
              <Icon icon="mdi:view-dashboard-outline" width="24" />
              <p class="capitalize">Dashboard</p>
            </div>
          </q-btn>
          <Setting />
          <Logout />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="px-4 md:hidden max-w-full">
      <div
        class="w-full bg-warning text-netral font-bold px-4"
        v-if="isFirst === 'true'"
      >
        <h3>Password has not been change, change it now.</h3>
      </div>
      <h1 class="text-2xl font-bold text-center">
        Welcome, {{ name || 'User' }}
      </h1>
      <div class="w-full flex items-center justify-center gap-4">
        <div
          class="bg-[#EBF9F1] h-[184px] p-4 rounded-2xl flex flex-col items-center justify-center"
          :class="amountLeaveCount === 1 ? 'w-full' : 'w-[45%]'"
        >
          <h1 class="text-center font-bold text-3xl">{{ leaveNow || 0 }}</h1>
          <p class="text-center">Is your remaining leave</p>
        </div>
        <div
          v-if="amountLeaveCount > 1"
          class="bg-info w-[45%] h-[184px] p-4 rounded-2xl flex flex-col items-center justify-center text-white"
        >
          <h1 class="text-center font-bold text-3xl">{{ leaveThen || 0 }}</h1>
          <p class="text-center">
            Is your remaining leave from
            <span class="underline">last year</span>
          </p>
        </div>
      </div>
      <router-view />
    </q-page-container>
    <q-page-container
      class="hid md:flex justify-between gap-4 flex-row min-h-screen px-4 w-full"
    >
      <div
        class="flex flex-col items-center"
        :class="amountLeaveCount === 1 ? 'justify-start' : 'justify-evenly'"
      >
        <h1 class="text-3xl font-bold text-center">
          Welcome, {{ name || 'User' }}
        </h1>

        <div
          class="bg-[#EBF9F1] w-[366px] h-[184px] rounded-2xl flex flex-col items-center justify-center"
        >
          <h1 class="text-center font-bold text-5xl">{{ leaveNow || 0 }}</h1>
          <p class="text-center">Is your remaining leave</p>
        </div>
        <div
          v-if="amountLeaveCount > 1"
          class="bg-info w-[366px] h-[184px] rounded-2xl flex flex-col items-center justify-center text-white"
        >
          <h1 class="text-center font-bold text-5xl">{{ leaveThen || 0 }}</h1>
          <p class="text-center">
            Is your remaining leave from
            <span class="underline">last year</span>
          </p>
        </div>
      </div>
      <div class="w-full">
        <div
          class="w-full bg-warning text-netral font-bold px-4"
          v-if="isFirst === 'true'"
        >
          <h3>Password has not been change, change it now.</h3>
        </div>
        <div
          class="w-full hid border-b-2 md:flex items-center justify-center gap-4"
        >
          <a
            href="/"
            :class="{
              'border-b-2 border-[#0021ED] border-solid text-primary font-semibold':
                $route.path === '/',
            }"
            class=""
            >History</a
          >
          <a
            href="/mandatory"
            :class="{
              'border-b-2 border-[#0021ED] border-solid text-primary font-semibold':
                $route.path === '/mandatory',
            }"
            >Mandatory</a
          >
          <a
            href="/optional"
            :class="{
              'border-b-2 border-[#0021ED] border-solid text-primary font-semibold':
                $route.path === '/optional',
            }"
            >Optional</a
          >
        </div>
        <router-view />
      </div>
    </q-page-container>

    <q-footer reveal class="bg-white text-black md:hidden">
      <q-toolbar class="">
        <div class="flex justify-start items-start flex-row w-full">
          <q-btn
            dense
            flat
            href="/"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] transition-all hover:bg-transparent pb-2 w-[33%]"
            :class="{
              'border-b-4 border-[#0021ED] text-primary font-semibold':
                $route.path === '/',
            }"
          >
            <p class="capitalize">History</p>
          </q-btn>
          <q-btn
            dense
            flat
            href="/mandatory"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] transition-all hover:bg-transparent w-[33%] pb-2"
            :class="{
              ' border-b-4 border-b-[#0021ED] text-primary':
                $route.path === '/mandatory',
            }"
          >
            <p class="capitalize">Mandatory</p>
          </q-btn>
          <q-btn
            dense
            flat
            href="/optional"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] transition-all hover:bg-transparent w-[33%] pb-2"
            :class="{
              ' border-b-4 border-b-[#0021ED] text-primary':
                $route.path === '/optional',
            }"
          >
            <p class="capitalize">Optional</p>
          </q-btn>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style>
@media (max-width: 786px) {
  .hid {
    display: none;
  }
}
</style>
