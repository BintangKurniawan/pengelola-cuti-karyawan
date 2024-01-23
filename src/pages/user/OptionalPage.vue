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
          <RejcBtn :id="data.leaveEmployeeId" />
        </div>
      </q-expansion-item>
    </div>
    <q-pagination
      v-model="current"
      color="primary"
      :max="pagination.rowsNumber"
      :max-pages="5"
      :ellipses="false"
      @update:model-value="getData(current)"
      :boundary-numbers="false"
    />

    <!-- <div v-else>
      <h3 class="text-center">No Data Available</h3>
    </div> -->
  </div>
</template>

<script>
import { ref } from 'vue';
// import { Icon } from '@iconify/vue'
import api from 'src/AxiosInterceptors';
// import Rejc from 'src/components/RejcBtn.vue';
import RejcBtn from 'src/components/RejcBtn.vue';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const $q = useQuasar;
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
      await api
        .get(`/leave/optional?page=${page}&perPage=10`, {
          withCredentials: true,
        })
        .then((resp) => {
          const allLeave = resp.data.data.employee.leaves;

          this.data = allLeave;
          this.pagination.rowsNumber = resp.data.meta.lastPage;
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
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
