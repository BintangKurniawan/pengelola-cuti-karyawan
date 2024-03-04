/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineStore, getActivePinia } from 'pinia';
import fs from 'fs';
const configFilePath = 'hm.json';

export const useConfigPortStore = defineStore('config', {
  state: () => ({
    port: 8080,
    ip: '10.10.101.57',
  }),
  getters: {
    getPort: (state) => state.port,
    getIp: (state) => state.ip,
  },
  actions: {
    setPort(port: number) {
      this.port = port;
    },
    setIp(ip: string) {
      this.ip = ip;
    },
    setConfig(data: any) {
      try {
        const jsonDATA = JSON.stringify(data, null, 2);
        fs.writeFileSync(configFilePath, jsonDATA);
        return true;
      } catch (err) {
        console.error('knjt', err);
        return false;
      }
    },
  },
  persist: true,
});
