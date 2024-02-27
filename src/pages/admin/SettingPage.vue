<template>
  <div class="m-4">
    <div class="flex items-start gap-4">
      <q-color v-model="hex" no-header-tabs class="my-picker" flat />
      <q-btn
        label="Save"
        class="capitalize"
        color="primary"
        @click="saveColor"
      />
    </div>

    <q-file
      v-model="img"
      accept="image/*"
      max-files="1"
      label="CLick to Upload"
      type="file"
      filled
      @update:model-value="handleUpload()"
      class="w-[300px]"
    />
    <q-img :src="imgURL" class="w-[276px] h-auto" />

    <q-btn label="Save" class="capitalize" color="primary" @click="saveImg" />
  </div>
</template>

<script>
import { ref } from 'vue';
import api from 'src/AxiosInterceptors';
import { setCssVar } from 'quasar';
export default {
  setup() {
    const imgURL = ref('');
    const img = ref(null);
    const handleUpload = () => {
      console.log('handleUpload is triggered');
      if (img.value) {
        imgURL.value = URL.createObjectURL(img.value);
      }
    };
    return { hex: ref(), img, imgURL, handleUpload };
  },
  mounted() {
    this.getSetting();
  },
  methods: {
    async getSetting() {
      await api
        .get('/webSetting', { withCredentials: true })
        .then((res) => {
          const setting = res.data.data[0];

          this.hex = setting.webColorCode;
          this.imgURL = setting.picture;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async saveColor() {
      await api
        .put(
          '/webSetting/update-color/1',
          { colorCode: this.hex },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res);
          localStorage.setItem('color', this.hex);
          setCssVar('primary', this.hex);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    async saveImg() {
      await api
        .patch(
          '/webSetting/update-image/1',
          { picture: this.img },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then((res) => {
          console.log(res);
          localStorage.setItem('logo', res.data.data.picture);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
