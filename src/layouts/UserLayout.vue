<script lang="ts">
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import Logout from 'src/components/LogoutBtn.vue';
import Setting from 'src/components/SettingBtn.vue';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
import AdminLinkBtn from 'src/components/AdminLinkBtn.vue';
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
  mounted() {
    this.getData();
  },
  methods: {
    showNav() {
      this.nav = !this.nav;
    },
    async getData() {
      const token = localStorage.getItem('token');
      await api
        .get('/employee/me', {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          this.name = resp.data.data.name;
          this.leaveNow = resp.data.data.amountOfLeave[0].amount;
          this.leaveThen = resp.data.data.amountOfLeave[1].amount;
          // if (resp.data.data.amountOfLeave[0].year === thisYear) {
          // } else {
          //   this.leaveNow = resp.data.data.amountOfLeave[1].amount;
          //   this.leaveThen = resp.data.data.amountOfLeave[0].amount;
          // }

          this.amountLeaveCount = resp.data.data.amountOfLeave.length;

          localStorage.setItem('nik', resp.data.data.employee.nik);
        })
        .catch((err) => {
          // if (err.response) {
          //   window.location.reload();
          // }
        });
    },
  },
  components: {
    Icon,
    Logout,
    Setting,
    AdminLinkBtn,
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
            id="dashboard"
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

    <q-page-container
      class="md:flex md:justify-between md:gap-4 md:flex-row md:min-h-screen px-4 max-w-full"
    >
      <div
        class="flex flex-col items-center"
        :class="amountLeaveCount === 1 ? 'justify-start' : ''"
      >
        <h1 class="md:text-3xl text-2xl font-bold text-center">
          Welcome, {{ name || 'User' }}
        </h1>

        <div class="flex md:flex-col w-full items-center justify-center gap-4">
          <div
            class="bg-[#EBF9F1] h-[184px] md:p-0 p-4 rounded-2xl flex flex-col items-center justify-center"
            :class="amountLeaveCount === 1 ? 'w-full' : 'w-[45%] md:w-[366px]'"
          >
            <h1 class="text-center font-bold md:text-5xl text-3xl">
              {{ leaveNow || 0 }}
            </h1>
            <p class="text-center">Is your remaining leave</p>
          </div>
          <div
            class="bg-info md:w-[366px] w-[45%] md:p-0 p-4 h-[184px] rounded-2xl flex flex-col items-center justify-center text-white"
          >
            <h1 class="text-center font-bold md:text-5xl text-3xl">
              {{ leaveThen || 0 }}
            </h1>
            <p class="text-center">
              Is your remaining leave from
              <span class="underline">last year</span>
            </p>
          </div>
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
          <div
            class="group relative transition-all"
            :class="{ 'text-primary font-semibold': $route.path === '/' }"
          >
            <span
              class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 w-0"
              :class="{ 'w-full': $route.path === '/' }"
            >
              &nbsp;
            </span>
            <a href="/">History</a>
          </div>
          <div
            class="group relative transition-all"
            :class="{
              'text-primary font-semibold': $route.path === '/special',
            }"
          >
            <span
              class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 w-0"
              :class="{ 'w-full': $route.path === '/special' }"
            >
              &nbsp;
            </span>
            <a href="/special">Special</a>
          </div>
          <div
            class="group relative transition-all"
            :class="{
              'text-primary font-semibold': $route.path === '/mandatory',
            }"
          >
            <span
              class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 w-0"
              :class="{ 'w-full': $route.path === '/mandatory' }"
            >
              &nbsp;
            </span>
            <a href="/mandatory">Mandatory</a>
          </div>
          <div
            class="group relative transition-all"
            :class="{
              'text-primary font-semibold': $route.path === '/optional',
            }"
          >
            <span
              class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 w-0"
              :class="{ 'w-full': $route.path === '/optional' }"
            >
              &nbsp;
            </span>
            <a href="/optional">Optional</a>
          </div>
        </div>
        <router-view />
      </div>
    </q-page-container>

    <q-footer reveal class="bg-white text-black md:hidden">
      <q-toolbar class="">
        <div class="flex justify-between items-center flex-row w-full">
          <AdminLinkBtn title="History" link="/" width="auto" />
          <AdminLinkBtn title="Special" link="/special" width="auto" />
          <AdminLinkBtn title="Mandatory" link="/mandatory" width="auto" />
          <AdminLinkBtn title="Optional" link="/optional" width="auto" />
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
