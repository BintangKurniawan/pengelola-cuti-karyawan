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
    <div v-if="data.length === 0 && !msg">
      <h3 class="text-center">No Data Available</h3>
    </div>
    <q-pagination
      v-if="pagination.rowsNumber > 1"
      v-model="current"
      color="primary"
      :max="pagination.rowsNumber"
      :max-pages="5"
      :ellipses="false"
      @update:model-value="getData(current)"
      :boundary-numbers="false"
    />
    <div v-if="msg">
      <h3 class="text-center text-negative font-bold text-2xl mt-5">
        {{ msg }}
      </h3>
    </div>
  </div>
</template>

<script>
import api from 'src/AxiosInterceptors';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const $q = useQuasar();
    return {
      current: ref(1),
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
  data() {
    return {
      data: [],
      loading: ref(false),
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
      msg: null,
    };
  },
  async mounted() {
    await this.getData(this.pagination.page);
  },
  methods: {
    async getData(page) {
      this.loading = true;
      await api
        .get(`/leave/mandatory?page=${page}&perPage=10`)
        .then((resp) => {
          this.data = resp.data.data;
          this.pagination.rowsNumber = resp.data.meta.lastPage;
          console.log(this.data);
          this.loading = false;
        })
        .catch((err) => {
          if (err.response.status === 403) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
            this.msg = msg;
          } else if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
    // FOR FORMAT DATE
    formatDate(dateString) {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-UK', options);
    },
  },
};
</script>
