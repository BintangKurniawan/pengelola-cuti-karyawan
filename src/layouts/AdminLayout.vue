<script lang="ts">
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import Logout from 'src/components/LogoutBtn.vue';
export default {
  setup() {
    return {
      route: useRoute(),
      router: useRouter(),
    };
  },
  data() {
    return {};
  },
  methods: {},
  components: {
    Icon,
    Logout,
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

        <div
          v-if="$route.path !== '/'"
          class="md:flex md:items-center md:gap-2 hid"
        >
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
        </div>

        <div v-if="$route.path !== '/'" class="">
          <Logout />
        </div>
      </q-toolbar>
    </q-header>
    <q-footer
      v-if="$route.path === '/admin/dashboard' || $route.path === '/admin/list'"
      reveal
      class="bg-white text-black"
    >
      <q-toolbar class="md:hidden">
        <div class="flex justify-start items-start flex-row w-full">
          <q-btn
            dense
            flat
            href="/admin/dashboard"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] transition-all hover:bg-transparent pb-2 w-[50%] flex items-start"
            :class="{
              ' border-b-4 border-b-[#0021ED]':
                $route.path === '/admin/dashboard',
            }"
          >
            <Icon icon="mdi:view-dashboard-outline" width="24" />
            <p class="capitalize">Dashboard</p>
          </q-btn>
          <q-btn
            dense
            flat
            href="/admin/list"
            class="hover:border-b-4 border-solid hover:border-b-[#0021ED] transition-all hover:bg-transparent w-[50%] pb-2"
            :class="{
              ' border-b-4 border-b-[#0021ED] ': $route.path === '/admin/list',
            }"
          >
            <Icon icon="mdi:list-box-outline" width="24" />
            <p class="capitalize">List of Leave</p>
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
