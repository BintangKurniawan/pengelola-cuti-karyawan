<template>
  <div class="flex justify-center items-center w-full">
    <div
      class="flex flex-wrap items-center w-full"
      v-if="data && data.length > 0"
    >
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
          <RejcBtn
            v-if="
              permissions.includes('Reject Optional Leave') &&
              !isTomorrow(data.startLeave)
            "
            :id="data.leaveEmployeeId"
            @get-data="handleChildEvent"
            :date="data.startLeave"
          />
        </div>
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
import { ref } from 'vue';
import api from 'src/AxiosInterceptors';
import RejcBtn from 'src/components/Negative_Components/RejectOptionalBtn.vue';
import { useQuasar } from 'quasar';
import { usePermissionStore } from 'src/stores/permissionStore';
export default {
  setup() {
    const $q = useQuasar();
    const perm = usePermissionStore();
    const permissions = perm.getPerm;
    return {
      permissions,
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
      msg: null,
    };
  },
  mounted() {
    this.getData(this.pagination.page);
  },
  methods: {
    isTomorrow(date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Menggunakan +1 karena kita ingin membandingkan dengan besok, bukan kemarin
      const givenDate = new Date(date);

      return givenDate < tomorrow;
    },
    handleChildEvent() {
      this.getData(this.current);
    },
    async getData(page) {
      await api
        .get(`/leave/optional?page=${page}&perPage=10`)
        .then((resp) => {
          const allLeave = resp.data.data.employee.leaves;

          this.data = allLeave;
          this.pagination.rowsNumber = resp.data.meta.lastPage;
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
  components: {
    RejcBtn,
  },
};
</script>
