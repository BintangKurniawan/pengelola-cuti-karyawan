<template>
  <div class="m-4 flex flex-col justify-center items-center">
    <div>
      <div class="text-2xl text-start border-b-2 border-primary w-fit">
        Color option
      </div>
      <div class="flex items-start gap-4 p-4">
        <q-color
          v-model="hex"
          no-header-tabs
          no-footer
          class="my-picker w-[276px]"
          flat
        />
        <q-btn
          label="Save"
          class="capitalize"
          color="primary"
          @click="saveColor"
        />
      </div>
    </div>

    <div>
      <div class="text-2xl text-start border-b-2 border-primary w-fit">
        Logo
      </div>
      <div class="flex flex-row gap-4 p-4">
        <div class="flex items-center flex-col justify-center">
          <q-file
            v-model="img"
            accept="image/*"
            max-files="1"
            label="Click to Upload"
            type="file"
            filled
            @update:model-value="handleUpload()"
            class="w-[276px]"
          />
          <q-img :src="imgURL" class="w-[276px] h-auto" />
        </div>
        <div>
          <q-btn
            label="Save"
            class="capitalize"
            color="primary"
            @click="saveImg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import api from 'src/AxiosInterceptors';
import { setCssVar } from 'quasar';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const $q = useQuasar();

    const imgURL = ref('');
    const img = ref(null);
    const handleUpload = () => {
      console.log('handleUpload is triggered');
      if (img.value) {
        imgURL.value = URL.createObjectURL(img.value);
      }
    };
    return {
      hex: ref(),
      img,
      imgURL,
      handleUpload,
      successNotif(msg) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'primary',
          multiLine: true,
        });
      },
      failedNotif(msg) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'negative',
          multiLine: true,
        });
      },
    };
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
          localStorage.setItem('logo', setting.picture);
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
          this.successNotif(res.data.message);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
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
          this.successNotif(res.data.message);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
