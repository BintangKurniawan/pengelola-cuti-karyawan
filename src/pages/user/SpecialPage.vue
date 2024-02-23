<template>
  <div class="flex flex-col overflow-x-scroll w-full hide-scroll">
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
      <template v-slot:body-cell-amount="props">
        <q-td class="text-center" :props="props">
          <div class="w-fill rounded-3xl px-3 py-2">
            <p class="">{{ props.row.amount }} day(s)</p>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-note="props">
        <q-td class="text-center" :props="props">
          <div v-if="props.row.note != null && props.row.status === 'REJECT'">
            <NoteBtn :note="props.row.note" :rejectBy="props.row.rejectBy" />
          </div>
          <div v-if="props.row.status === 'APPROVE' && props.row.approveBy">
            <NoteBtn :approveBy="props.row.approveBy" />
          </div>
          <div v-if="props.row.status === 'WAITING'">
            <p>Note not found</p>
          </div>
        </q-td>
      </template>
    </q-table>
    <div v-else>
      <h3 class="text-center">No Data Available</h3>
    </div>
    <div class="row justify-center" v-if="pagination.rowsNumber > 1">
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
  </div>
</template>

<script>
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import NoteBtn from 'src/components/Display_Components/NoteBtn.vue';
export default {
  setup() {
    const column = [
      {
        name: 'status',
        label: 'Status',
        align: 'center',
        field: 'statust',
      },
      {
        name: 'leaveTitle',
        label: 'Leave Title',
        align: 'center',
        field: 'leaveTitle',
        // style: 'width: 400px',
      },
      {
        name: 'start',
        label: 'Start Leave',
        align: 'center',
        field: 'startLeave',
        style: 'width: 250px;',
      },
      {
        name: 'end',
        label: 'End Leave',
        align: 'center',
        field: 'endLeave',
        style: 'width: 100px;',
      },
      {
        name: 'gender',
        label: 'Gender',
        align: 'center',
        field: 'gender',
        style: 'width: 150px;',
      },
      {
        name: 'amount',
        label: 'Amount',
        align: 'center',
        field: 'amount',
        style: 'width: 250px;',
      },

      {
        name: 'note',
        label: 'Reject Note',
        align: 'center',
        field: 'note',
      },
    ];
    const $q = useQuasar();
    return {
      column,
      current: ref(1),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      successNotif(msg) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'primary',
          multiLine: true,
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
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
  components: {
    NoteBtn,
  },
  methods: {
    async getData(page) {
      const perPage = window.innerWidth >= 768 ? 8 : 5;
      await api
        .get(
          `/leave/employee-special-leave/history/me?page=${page}&perPage=${perPage}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          this.data = res.data.data.employee.specialLeave;
          this.pagination.rowsNumber = res.data.meta.lastPage;
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },

    // FORMAT DATE
    formatDate(dateString) {
      // const options = { day: 'numeric', month: 'short', year: 'numeric' };
      // const date = new Date(dateString);
      // return date.toLocaleDateString('en-UK', options);

      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-UK', options);
      // return moment(dateString).local(true).format('ll');
    },
  },
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

.hide-scroll::-webkit-scrollbar-track {
  box-shadow: none !important;
}
</style>
