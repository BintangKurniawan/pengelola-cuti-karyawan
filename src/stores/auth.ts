import { defineStore } from 'pinia';
import func from './func';

export const authStore = defineStore({
  id: 'auth',
  state: () => ({
    accessToken: '',
    user: {
      id: 0,
      username: '',
      email: '',
      name: '',
      picture: '',
      role: {
        id: 0,
        name: '',
      },
    },
  }),
  actions: {
    getAccessToken() {
      this.accessToken = func.getData(
        this.$id,
        'accessToken',
        this.$state,
        'local'
      );
      return this.accessToken;
    },
    getUser() {
      this.user = func.getData(this.$id, 'user', this.$state, 'local');
      return this.user;
    },
    setAccessToken(accessToken = '') {
      func.saveData(this.$id, 'accessToken', this.$state, accessToken, 'local');
      this.accessToken = accessToken;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setUser(data: any) {
      func.saveData(this.$id, 'user', this.$state, data, 'local');
      this.user = data;
    },
    getData(index: string | number) {
      return func.getData(this.$id, index, this.$state, 'local');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData(index: string | number, data: any) {
      func.saveData(this.$id, index, this.$state, data, 'local');
    },

    clearData() {
      const data = {
        accessToken: '',
        user: {
          id: 0,
          username: '',
          email: '',
          name: '',
          picture: '',
          role: {
            id: 0,
            name: '',
          },
        },
      };
      this.$state = data;
      localStorage.setItem(this.$id, JSON.stringify(data));
    },
  },
});
