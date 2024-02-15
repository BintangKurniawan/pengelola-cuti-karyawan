<script lang="ts">
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import Logout from 'src/components/LogoutBtn.vue';
import SettingBtn from 'src/components/SettingBtn.vue';
import AdminLinkBtn from 'src/components/Display_Components/AdminLinkBtn.vue';
export default {
  setup() {
    const page = window.innerWidth >= 1280 ? true : false;
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
        <div class="lg:hidden">
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
        <AdminLinkBtn
          title="Home"
          link="/"
          icon="home"
          width="full"
          v-if="roleId !== '1'"
        />
        <AdminLinkBtn
          title="Dashboard"
          link="/admin/dashboard"
          icon="view-dashboard-outline"
          width="full"
        />
        <AdminLinkBtn
          v-if="roleId !== '1'"
          title="List of Leave"
          link="/admin/list-leave"
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
          link="/admin/special-leave"
          icon="list-box-outline"
          width="full"
          v-if="roleId !== '1'"
        />
        <AdminLinkBtn
          title="Role"
          link="/admin/role"
          icon="worker-outline"
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
  </q-layout>
</template>

<style>
@media (max-width: 768px) {
  .hid {
    display: none;
  }
}
</style>
