<script lang="ts">
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import Logout from 'src/components/LogoutBtn.vue';
import SettingBtn from 'src/components/SettingBtn.vue';
import AdminLinkBtn from 'src/components/Display_Components/AdminLinkBtn.vue';
import { usePermissionStore } from 'src/stores/permissionStore';
export default {
  setup() {
    const page = window.innerWidth >= 1024 ? true : false;
    const leftDrawerOpen = ref(page);
    const roleId = localStorage.getItem('role');
    const img = localStorage.getItem('logo') || undefined;
    const perm = usePermissionStore();
    const permissions = perm.getPerm;
    return {
      permissions,
      img,
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
  <q-layout view="hHh Lpr lFf">
    <q-header reveal class="bg-white text-black" bordered>
      <q-toolbar class="flex items-center justify-between p-4">
        <q-img :src="img" class="w-[130px] h-auto" fetchpriority="low" />
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
        <!-- tambahin v if lagi di sini -->
        <AdminLinkBtn
          title="Home"
          link="/"
          icon="home"
          width="full"
          v-if="
            permissions.includes('Get Leave History for Current User') ||
            permissions.includes('View Special Leave History') ||
            permissions.includes('View Optional Leave') ||
            permissions.includes('View Mandatory Leave')
          "
        />
        <!-- tambahin v if lagi di sini -->
        <AdminLinkBtn
          v-if="permissions.includes('Get Employee')"
          title="Dashboard"
          link="/admin/dashboard"
          icon="view-dashboard-outline"
          width="full"
        />
        <!-- tambahin v if lagi di sini -->
        <AdminLinkBtn
          v-if="
            permissions.includes('View All Leave History') ||
            permissions.includes('View All Employee Special Leaves')
          "
          title="List of Leave"
          link="/admin/list-leave"
          icon="list-status"
          width="full"
        />
        <!-- tambahin v if lagi di sini -->
        <AdminLinkBtn
          v-if="permissions.includes('Send Email for Leave')"
          title="Email Organizer"
          link="/admin/email"
          icon="email-outline"
          width="full"
        />
        <AdminLinkBtn
          title="List of Position"
          link="/admin/positions"
          icon="family-tree"
          width="full"
        />
        <!-- tambahin v if lagi di sini -->
        <AdminLinkBtn
          v-if="permissions.includes('View All The List Of Special Leave')"
          title="Special Leave"
          link="/admin/special-leave"
          icon="list-box-outline"
          width="full"
        />
        <!-- tambahin v if lagi di sini -->
        <AdminLinkBtn
          v-if="permissions.includes('Get All Role')"
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
