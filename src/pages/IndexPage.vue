<template>
  <q-table
    v-if="data && data.length > 0"
    class="my-table table-rounded"
    flat
    :columns="column"
    :rows="data"
    v-model:pagination="pagination"
    hide-bottom
  >
    <template v-slot:body-cell-status="props">
      <q-td class="text-center" :props="props">
        <div
          class="w-fill rounded-3xl px-3 py-2"
          :class="{
            'bg-[#EBF9F1] text-[#1F9254] ': props.row.status === 'APPROVE',
            'bg-[#FBE7E8] text-[#A30D11] ': props.row.status === 'REJECT',
            'bg-[#FEF2E5] text-[#CD6200] ': props.row.status === 'WAITING',
          }"
        >
          <p class="font-semibold">{{ props.row.status }}</p>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-type="props">
      <q-td class="text-center" :props="props">
        <div class="w-fill rounded-3xl px-3 py-2">
          <p class="font-semibold">{{ props.row.typeOfLeave.name }}</p>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-start="props">
      <q-td class="text-center" :props="props">
        <div class="w-fill rounded-3xl px-3 py-2">
          <p class="font-semibold">{{ formatDate(props.row.startLeave) }}</p>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-end="props">
      <q-td class="text-center" :props="props">
        <div class="w-fill rounded-3xl px-3 py-2">
          <p class="font-semibold">{{ formatDate(props.row.endLeave) }}</p>
        </div>
      </q-td>
    </template>
  </q-table>
  <div class="row justify-center" v-if="data && data.length > 0">
    <q-pagination
      v-model="current"
      color="primary"
      :max="pagination.rowsNumber"
      :max-pages="5"
      :ellipses="false"
      @update:model-value="getData(current)"
      :boundary-numbers="false"
    />
  </div>

  <div v-else>
    <h3 class="text-center">No Data Available</h3>
  </div>
</template>

<script lang="ts">
// import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
// import moment from 'moment';
// import { date } from 'quasar';
export default {
  components: {
    // Icon,
  },
  setup() {
    const column = [
      {
        name: 'status',
        label: 'Status',
        align: 'center',
        field: 'statust',
      },
      {
        name: 'type',
        label: 'Type',
        align: 'center',
        field: 'type',
        style: 'width: 300px;',
      },
      {
        name: 'start',
        label: 'Start Leave',
        align: 'center',
        field: 'startLeave',
        style: 'width: 250px;',
        sortable: true,
      },
      {
        name: 'end',
        label: 'End Leave',
        align: 'center',
        field: 'endLeave',
        style: 'width: 100px;',
      },
      {
        name: 'leaveUse',
        label: 'Leave Used',
        align: 'center',
        field: 'leaveUse',
      },

      {
        name: 'reason',
        label: 'Reason',
        align: 'center',
        field: 'reason',
        style: 'width: 400px',
      },
    ];
    const $q = useQuasar();
    return {
      column,
      current: ref(1),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      successNotif(msg: any) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'primary',
          multiLine: true,
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      failedNotif(msg: any) {
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
      filter: '',
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
      data: [],
      isFirst: localStorage.getItem('firstLogin'),
    };
  },
  async mounted() {
    await this.getData(this.pagination.page);
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getData(page: number | undefined) {
      await api
        .get(`/leave/history/me?page=${page}&perPage=10`, {
          withCredentials: true,
        })
        .then((resp) => {
          this.data = resp.data.data.employee.leaves;
          this.pagination.rowsNumber = resp.data.meta.lastPage;
          const msg = resp.data.message;
          // this.successNotif(msg);
          console.log(this.data);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatDate(dateString: any) {
      // const options = { day: 'numeric', month: 'short', year: 'numeric' };
      // const date = new Date(dateString);
      // return date.toLocaleDateString('en-UK', options);

      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-UK', options);
      // return moment(dateString).local(true).format('ll');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tes(nik: any) {
      console.log(nik);
    },
  },
  computed: {},
};
</script>

<style>
.my-table {
  border-radius: 0.375rem;
}
.q-table tbody tr:nth-child(even) {
  background-color: #f7f6fe; /* Warna abu-abu untuk baris genap */
}

.q-table tbody tr:nth-child(odd) {
  background-color: #ffffff; /* Warna putih untuk baris ganjil */
}

.q-table thead th {
  font-weight: bold;
}

.table-rounded thead tr:first-child th:first-child {
  border-radius: 10px 0 0 10px;
}

.table-rounded thead tr:first-child th:last-child {
  border-radius: 0 10px 10px 0;
}

.table-rounded tbody tr {
  border-spacing: 0.25rem 0.25rem;
  row-gap: 1px;
  margin: 10px 0 !important;
}
.q-table tbody tr:hover {
  background-color: initial;
}
.q-table tbody tr:margin {
  margin: 10px 0 !important;
}
</style>
