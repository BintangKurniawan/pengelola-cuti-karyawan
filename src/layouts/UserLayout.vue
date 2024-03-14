<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import Logout from 'src/components/LogoutBtn.vue';
import Setting from 'src/components/SettingBtn.vue';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
import AdminLinkBtn from 'src/components/Display_Components/AdminLinkBtn.vue';
import ApplyLeaveBtn from 'src/components/Set_Components/ApplyLeaveBtn.vue';
import { useColorStore } from 'src/stores/colorStore';
import { usePermissionStore } from 'src/stores/permissionStore';

export default {
  setup() {
    const role = localStorage.getItem('role');
    const $q = useQuasar();
    const nik = localStorage.getItem('nik');
    const store = useColorStore();
    const link = [
      {
        title: 'History',
        link: '/',
        access: 'Get Leave History for Current User',
      },
      {
        title: 'Special',
        link: '/special',
        access: 'View Special Leave History',
      },
      {
        title: 'Mandatory',
        link: '/mandatory',
        access: 'View Mandatory Leave',
      },
      {
        title: 'Optional',
        link: '/optional',
        access: 'View Optional Leave',
      },
    ];

    const perm = usePermissionStore();
    const img = localStorage.getItem('logo') || undefined;
    const permissions = perm.getPerm;

    const adminPage = [
      {
        title: 'Dashboard',
        link: '/admin/dashboard',
        icon: 'view-dashboard-outline',
        access: 'dashboard',
      },
      {
        title: 'List of Leave',
        link: '/admin/list-leave',
        icon: 'list-status',
        access: 'list of leave',
      },
      {
        title: 'Email Organizer',
        link: '/admin/email',
        icon: 'email-outline',
        access: 'email organizer',
      },
      {
        title: 'List of Position',
        link: '/admin/positions',
        icon: 'family-tree',
        access: 'list of position',
      },
      {
        title: 'Special Leave',
        link: '/admin/special-leave',
        icon: 'list-box-outline',
        access: 'special leave',
      },
      {
        title: 'Role',
        link: '/admin/role',
        icon: 'worker-outline',
        access: 'role',
      },
    ];

    return {
      adminPage,
      permissions,
      link,
      nik,
      store,
      color: '',
      role,
      img,
      route: useRoute(),
      router: useRouter(),
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

    // const color = localStorage.getItem('color');
    // this.store.setColor(color);
    // this.color = this.store.primaryColor;
    // console.log(this.color);
  },
  methods: {
    showNav() {
      this.nav = !this.nav;
    },
    // shouldDisplayBtn(access: string) {
    //   if (access === 'dashboard') {
    //     return this.permissions.includes('Get Employee');
    //   } else if (access === 'list of leave') {
    //     return this.permissions.includes('View All Leave History');
    //   } else if (access === 'email organizer') {
    //     return this.permissions.includes('Send Email for Leave');
    //   } else if (access === 'list of position') {
    //     return this.permissions.includes('Get Position');
    //   } else if (access === 'special leave') {
    //     return this.permissions.includes('View All Special Leave History');
    //   } else if (access === 'role') {
    //     return this.permissions.includes('Get All Role');
    //   } else {
    //     return false;
    //   }
    // },
    async getData() {
      const token = localStorage.getItem('token');
      await api
        .get('/employee/me', {
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
          if (err.response) {
            this.failedNotif(err.response.data.message);
          }
        });
    },
  },
  components: {
    Icon,
    Logout,
    Setting,
    AdminLinkBtn,
    ApplyLeaveBtn,
  },
};
</script>

<template>
  <q-layout view="lHh lpR fFf">
    <q-header reveal class="bg-white text-black">
      <q-toolbar class="flex justify-between p-4 items-center">
        <q-img :src="img" class="w-[130px] h-[29px]" />

        <div class="md:hidden">
          <q-btn dense flat class="" @click="showNav">
            <Icon icon="mdi:menu" width="24" />
          </q-btn>
        </div>

        <div class="md:flex hid">
          <!-- <div v-for="item in adminPage" :key="item.link">
            <q-btn
              v-if="shouldDisplayBtn(item.access)"
              dense
              flat
              id="dashboard"
              :href="item.link"
              class="flex items-start w-full md:w-fit hover:bg-gray-100 p-4"
            >
              <div class="flex items-center gap-4">
                <Icon :icon="`mdi:` + item.icon" width="24" />
                <p class="capitalize">{{ item.title }}</p>
              </div>
            </q-btn>
          </div> -->
          <q-btn
            v-if="
              permissions.includes(
                'Get Employee' ||
                  'Send Email for Leave' ||
                  'View All Leave History' ||
                  'View All Employee Special Leave' ||
                  'Get All Role'
              )
            "
            dense
            flat
            id="dashboard"
            href="/admin/dashboard"
            class="flex items-start w-full md:w-fit hover:bg-gray-100 p-4"
          >
            <div class="flex items-center gap-4">
              <Icon :icon="`mdi:view-dashboard-outline`" width="24" />
              <p class="capitalize">Admin Side</p>
            </div>
          </q-btn>
          <Setting />
          <Logout />
        </div>
      </q-toolbar>

      <q-toolbar class="transition-all absolute" v-if="nav">
        <div class="w-full bg-white h-[150x]">
          <q-btn
            v-if="
              permissions.includes(
                'Get Employee' ||
                  'Send Email for Leave' ||
                  'View All Leave History' ||
                  'View All Employee Special Leave' ||
                  'Get All Role'
              )
            "
            dense
            flat
            href="/admin/dashboard"
            class="flex items-start w-full md:w-fit hover:bg-gray-100 p-4"
          >
            <div class="flex items-center gap-4">
              <Icon icon="mdi:view-dashboard-outline" width="24" />
              <p class="capitalize">Admin Side</p>
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
            v-for="item in link"
            :key="item.link"
            :class="!permissions.includes(item.access) ? 'hidden' : ''"
          >
            <div
              v-if="permissions.includes(item.access)"
              class="group relative transition-all"
              :class="`${
                $route.path === item.link ? `text-primary font-semibold` : ''
              }`"
            >
              <!-- :style="{ color: $route.path === item.link ? color : '' }" -->
              <span
                class="h-[2px] inline-block absolute bg-primary left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 w-0"
                :class="{ 'w-full': $route.path === item.link }"
              >
                <!-- :style="{ backgroundColor: color }" -->
                &nbsp;
              </span>
              <a :href="item.link">{{ item.title }}</a>
            </div>
          </div>
        </div>
        <router-view />
      </div>
      <q-page-sticky :offset="[18, 18]">
        <ApplyLeaveBtn />
      </q-page-sticky>
    </q-page-container>

    <q-footer reveal class="bg-white text-black md:hidden">
      <q-toolbar class="">
        <div class="flex justify-between items-center flex-row w-full">
          <div
            :class="!permissions.includes(item.access) ? 'hidden' : ''"
            v-for="item in link"
            :key="item.link"
          >
            <AdminLinkBtn
              v-if="permissions.includes(item.access)"
              :title="item.title"
              :link="item.link"
              width="auto"
            />
          </div>
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
