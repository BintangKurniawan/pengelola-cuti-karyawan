<template>
  <div class="flex justify-center items-center w-full">
    <div
      v-if="data && data.length > 0"
      class="flex flex-wrap items-center w-full"
    >
      <q-expansion-item
        v-for="(data, i) in data"
        :label="data.reason"
        class="w-[50%] font-bold"
        v-bind:key="i"
      >
        <p class="px-4 text-xs">
          {{ formatDate(data.startLeave) }} - {{ formatDate(data.endLeave) }}
        </p>
      </q-expansion-item>
    </div>
  </div>
</template>

<script>
import api from 'src/AxiosInterceptors';
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
          .get('/leave/mandatory', { withCredentials: true })
          .then((resp) => {
            this.data = resp.data.data.leaves;

            console.log(this.data);
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
  },
};
</script>

<style lang="scss" scoped></style>
