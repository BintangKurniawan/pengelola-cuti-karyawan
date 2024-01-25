<script lang="ts">
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import Logout from 'src/components/LogoutBtn.vue';
import SettingBtn from 'src/components/SettingBtn.vue';
export default {
  setup() {
    const roleId = localStorage.getItem('role');
    return {
      roleId,
      route: useRoute(),
      router: useRouter(),
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
            <p class="capitalize">Home</p>
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
            <p class="capitalize">Dashboard</p>
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
            <p class="capitalize">List of Leave</p>
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
            <p class="capitalize">List of Position</p>
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
            <Icon icon="mdi:list-box-outline" width="24" />
            <p class="capitalize">Position</p>
          </q-btn>
        </div>
      </q-toolbar>
    </q-footer>
    <q-page-container class="px-4">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
@media (max-width: 768px) {
  .hid {
    display: none;
  }
}
</style>
