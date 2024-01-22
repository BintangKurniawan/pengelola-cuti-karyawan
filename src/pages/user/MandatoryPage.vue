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

    <q-pagination
      v-if="data && data.length > 0"
      v-model="current"
      color="primary"
      :max="pagination.rowsNumber"
      :max-pages="5"
      :ellipses="false"
      @update:model-value="getData(current)"
      :boundary-numbers="false"
    />

    <div v-else>
      <h3 class="text-center">No Data Available</h3>
    </div>
  </div>
</template>

<script>
import api from 'src/AxiosInterceptors';
import { ref } from 'vue';
export default {
  setup() {
    return { current: ref(1) };
  },
  data() {
    return {
      data: [],
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
    };
  },
  mounted() {
    this.getData(this.pagination.page);
  },
  methods: {
    async getData(page) {
      try {
        await api
          .get(`/leave/mandatory?page=${page}&perPage=10`, {
            withCredentials: true,
          })
          .then((resp) => {
            this.data = resp.data.data;
            this.pagination.rowsNumber = resp.data.meta.lastPage;
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
