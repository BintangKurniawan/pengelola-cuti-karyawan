/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineStore, getActivePinia } from 'pinia';
import fs from 'fs';
const configFilePath = 'hm.json';
// const stateKey = 'port';

export const useConfigPortStore = defineStore('config', {
  state: () => ({
    port: '8080',
    ip: '10.10.101.79',
  }),
  getters: {
    getPort: (state) => state.port,
    getIp: (state) => state.ip,
  },
  actions: {
    setPort(port: string) {
      this.port = port;
    },
    setIp(ip: string) {
      this.ip = ip;
    },
    // setConfig(data: any) {
    //   try {
    //     const jsonDATA = JSON.stringify(data, null, 2);
    //     fs.writeFileSync(configFilePath, jsonDATA);
    //     return true;
    //   } catch (err) {
    //     console.error('knjt', err);
    //     return false;
    //   }
    // },
  },
  persist: true,
  share: {
    omit: ['port'],
    enable: true,
    initialize: true,
  },
});

// const savedPort = JSON.parse(localStorage.getItem(stateKey));
// const store = useConfigPortStore();
// if (savedPort) {
//   store.$state = savedPort;
// }

// store.$subscribe((mutation, state) => {
//   localStorage.setItem(stateKey, JSON.stringify(state));
// });

// window.addEventListener('storage', (event) => {
//   if (event.key === stateKey) {
//     store.$state = JSON.parse(event.newValue);
//   }
// });
