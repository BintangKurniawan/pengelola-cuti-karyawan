import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    port: 1000,
  }),
  getters: {
    getPort: (state) => state.port,
  },
  actions: {},
});

module.exports = { useConfigStore };
