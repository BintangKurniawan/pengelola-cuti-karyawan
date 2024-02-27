import { defineStore } from 'pinia';

export const useColorStore = defineStore('color', {
  state: () => ({
    primaryColor: '',
    img: '',
  }),
  getters: {
    getColor: (state) => state.primaryColor,
    getImg: (state) => state.img,
  },
  actions: {
    setColor(color: string) {
      this.primaryColor = color;
    },

    setImg(img: string) {
      this.img = img;
    },
  },
});
