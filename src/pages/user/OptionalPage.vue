<template>
  <div class="flex justify-center items-center w-full">
    <div class="flex flex-wrap items-center w-full">
      <q-expansion-item
        v-for="(data, i) in data"
        :label="data.reason"
        class="w-[50%] font-bold"
        v-bind:key="i"
      >
        <div class="flex items-center">
          <p class="px-4 text-xs">
            {{ formatDate(data.startLeave) }} - {{ formatDate(data.endLeave) }}
          </p>
          <RejcBtn :id="data.id" />
        </div>
      </q-expansion-item>
    </div>
  </div>
</template>

<script>
// import { defineProps, ref } from 'vue'
// import { Icon } from '@iconify/vue'
import api from 'src/AxiosInterceptors';
// import Rejc from 'src/components/RejcBtn.vue';
import RejcBtn from 'src/components/RejcBtn.vue';
export default {
  setup() {
    return {};
  },
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        await api
          .get('/leave/optional', { withCredentials: true })
          .then((resp) => {
            this.data = resp.data.data;
          });
      } catch (err) {
        console.error(err);
      }
    },
    formatDate(dateString) {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-UK', options);
    },

    acc(id) {
      console.log(id);
    },
  },
  components: {
    // Icon,
    RejcBtn,
  },
};
</script>

<style lang="scss" scoped></style>
