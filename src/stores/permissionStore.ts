import { defineStore } from 'pinia';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: [],
  }),
  getters: {
    getPerm: (state) => state.permissions,
  },
  actions: {
    setPerm(permission: []) {
      this.permissions = permission;
    },
    removePerm() {
      this.permissions = [];
    },
  },
  persist: true,
});
