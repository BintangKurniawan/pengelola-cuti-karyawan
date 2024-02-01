<script lang="ts">
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import Logout from 'src/components/LogoutBtn.vue';
import SettingBtn from 'src/components/SettingBtn.vue';
import AdminLinkBtn from 'src/components/AdminLinkBtn.vue';
export default {
  setup() {
    const page = window.innerWidth >= 768 ? true : false;
    const leftDrawerOpen = ref(page);
    const roleId = localStorage.getItem('role');
    return {
      roleId,
      route: useRoute(),
      router: useRouter(),
      leftDrawerOpen,
    };
  },
  data() {
    return { nav: ref(false) };
  },
  methods: {},
  components: {
    Icon,
    Logout,
    SettingBtn,
    AdminLinkBtn,
  },
};
</script>

<!-- <template>
  <q-layout view="lHh lpR fFf">
    <q-header reveal class="bg-white text-black">
      <q-toolbar class="flex justify-between p-4 items-center">
        <q-img
          src="../assets/img/logo_wgs_fullBlack.svg"
          loading="lazy"
          alt="wgs"
          class="w-[130px] h-[29px]"
          fetchpriority="low"
        />

        <div class="md:flex md:items-center md:gap-2 hid">
          <q-btn
            dense
            flat
            href="/"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] rounded-xl transition-all hover:bg-transparent pb-2"
            :class="{
              ' border-b-4 border-b-[#0021ED] text-primary font-semibold':
                $route.path === '/',
            }"
          >
            <Icon icon="mdi:home" width="24" />
            <p class="capitalize text-xs">Home</p>
          </q-btn>
          <q-btn
            dense
            flat
            href="/admin/dashboard"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] rounded-xl transition-all hover:bg-transparent pb-2"
            :class="{
              ' border-b-4 border-b-[#0021ED] text-primary font-semibold':
                $route.path === '/admin/dashboard',
            }"
          >
            <Icon icon="mdi:view-dashboard-outline" width="24" />
            <p class="capitalize text-xs">Dashboard</p>
          </q-btn>
          <q-btn
            v-if="roleId !== '1'"
            dense
            flat
            href="/admin/list"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] rounded-xl transition-all hover:bg-transparent pb-2"
            :class="{
              ' border-b-4 border-b-[#0021ED] text-primary font-semibold':
                $route.path === '/admin/list',
            }"
          >
            <Icon icon="mdi:list-box-outline" width="24" />
            <p class="capitalize text-xs">List of Leave</p>
          </q-btn>
          <q-btn
            dense
            flat
            href="/admin/positions"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] rounded-xl transition-all hover:bg-transparent pb-2"
            :class="{
              ' border-b-4 border-b-[#0021ED] text-primary font-semibold':
                $route.path === '/admin/positions',
            }"
          >
            <Icon icon="mdi:family-tree" width="24" />
            <p class="capitalize text-xs">List of Position</p>
          </q-btn>
        </div>

        <div v-if="$route.path !== '/'" class="md:flex hid">
          <SettingBtn />
          <Logout />
        </div>

        <div class="md:hidden">
          <q-btn dense flat class="" @click="nav = !nav">
            <Icon icon="mdi:menu" width="24" />
          </q-btn>
        </div>
      </q-toolbar>

      <q-toolbar class="transition-all absolute" v-if="nav">
        <div class="w-full bg-white h-[150x]">
          <SettingBtn />
          <Logout />
        </div>
      </q-toolbar>
    </q-header>
    <q-footer reveal class="bg-white text-black">
      <q-toolbar class="md:hidden">
        <div class="flex justify-center items-start flex-row w-full">
          <q-btn
            dense
            flat
            href="/"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] transition-all hover:bg-transparent pb-2 w-[20%] flex items-start"
            :class="{
              ' border-b-4 border-b-[#0021ED]': $route.path === '/',
            }"
          >
            <Icon icon="mdi:home" width="24" />
            <p class="capitalize">Home</p>
          </q-btn>
          <q-btn
            dense
            flat
            href="/admin/dashboard"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] transition-all hover:bg-transparent pb-2 w-[30%] flex items-start"
            :class="{
              ' border-b-4 border-b-[#0021ED]':
                $route.path === '/admin/dashboard',
            }"
          >
            <Icon icon="mdi:view-dashboard-outline" width="24" />
            <p class="capitalize">Dashboard</p>
          </q-btn>
          <q-btn
            v-if="roleId !== '1'"
            dense
            flat
            href="/admin/list"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] transition-all hover:bg-transparent w-[20%] pb-2"
            :class="{
              ' border-b-4 border-b-[#0021ED] ': $route.path === '/admin/list',
            }"
          >
            <Icon icon="mdi:list-box-outline" width="24" />
            <p class="capitalize">Leave</p>
          </q-btn>
          <q-btn
            dense
            flat
            href="/admin/positions"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] transition-all hover:bg-transparent w-[30%] pb-2"
            :class="{
              ' border-b-4 border-b-[#0021ED] ':
                $route.path === '/admin/positions',
            }"
          >
            <Icon icon="mdi:family-tree" width="24" />
            <p class="capitalize">Position</p>
          </q-btn>
        </div>
      </q-toolbar>
    </q-footer>
    <q-page-container class="px-4">
      <router-view />
    </q-page-container>
  </q-layout>
</template> -->

<template>
  <q-layout view="hHr lpr lFr">
    <q-header reveal class="bg-white text-black" bordered>
      <q-toolbar class="flex items-center justify-between">
        <q-img
          src="../assets/img/logo_wgs_fullBlack.svg"
          loading="lazy"
          alt="wgs"
          class="w-[130px] h-[29px]"
          fetchpriority="low"
        />
        <div class="md:hidden">
          <q-btn dense flat class="" @click="leftDrawerOpen = !leftDrawerOpen">
            <Icon icon="mdi:menu" width="24" />
          </q-btn>
        </div>
      </q-toolbar>

      <q-toolbar class="transition-all absolute" v-if="nav">
        <div class="w-full bg-white h-[150x]">
          <SettingBtn />
          <Logout />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="200"
      class="p-5 flex flex-col justify-between"
    >
      <div class="flex flex-col md:items-start gap-4">
        <AdminLinkBtn title="Home" link="/" icon="home" width="full" />
        <AdminLinkBtn
          title="Dashboard"
          link="/admin/dashboard"
          icon="view-dashboard-outline"
          width="full"
        />
        <AdminLinkBtn
          v-if="roleId !== '1'"
          title="List of Leave"
          link="/admin/list"
          icon="list-status"
          width="full"
        />
        <AdminLinkBtn
          title="List of Position"
          link="/admin/positions"
          icon="family-tree"
          width="full"
        />
        <AdminLinkBtn
          title="Special Leave"
          link="/admin/leave"
          icon="list-box-outline"
          width="full"
        />
      </div>

      <div class="">
        <SettingBtn />
        <Logout />
      </div>
    </q-drawer>

    <q-page-container class="">
      <router-view />
    </q-page-container>

    <!-- <q-footer reveal class="bg-white text-black">
      <q-toolbar class="md:hidden">
        <div class="flex justify-between items-start flex-nowrap flex-row">
          <AdminLinkBtn title="Home" link="/" icon="home" width="auto" />
          <AdminLinkBtn
            title="Dashboard"
            link="/admin/dashboard"
            icon="view-dashboard-outline"
            width="auto"
          />
          <AdminLinkBtn
            v-if="roleId !== '1'"
            title="Leave"
            link="/admin/list"
            icon="list-status"
            width="auto"
          />
          <AdminLinkBtn
            title="Position"
            link="/admin/positions"
            icon="family-tree"
            width="auto"
          />
          <AdminLinkBtn
            title="Special Leave"
            link="/admin/leave"
            icon="list-box-outline"
            width="auto"
          />
        </div>
      </q-toolbar>
    </q-footer> -->
  </q-layout>
</template>

<style>
@media (max-width: 768px) {
  .hid {
    display: none;
  }
}
</style>
