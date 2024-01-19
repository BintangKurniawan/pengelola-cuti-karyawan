<template>
  <q-table
    class="my-table table-rounded"
    flat
    :columns="column"
    :rows="data"
    hide-pagination
    v-model:pagination="pagination"
  >
    <template v-slot:top-left>
      <div class="px-2 rounded-lg border-2 border-secondary">
        <q-input
          borderless
          dense
          v-model="search"
          debounce="300"
          input-class="placeholder-color text-black"
          @update:model-value="getData(pagination.page)"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" class="text-black" />
          </template>
        </q-input>
      </div>
    </template>
    <template v-slot:body-cell-type="props">
      <q-td :props="props" class="text-center">
        <div class="w-fill px-3 py-2">
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
    <template v-slot:body-cell-action="props">
      <q-td
        :props="props"
        class="flex gap-1 justify-center items-center text-center"
      >
        <div
          v-if="props.row.status === 'REJECT' || props.row.status === 'WAITING'"
        >
          <Approve :id="props.row.leaveEmployeeId" />
        </div>
        <div
          v-if="
            props.row.status === 'APPROVE' || props.row.status === 'WAITING'
          "
        >
          <Reject
            :type="props.row.typeOfLeave.name"
            :id="props.row.leaveEmployeeId"
          />
        </div>
      </q-td>
    </template>

    <template v-slot:bottom>
      <q-pagination
        v-model="current"
        color="primary"
        :max="pagination.rowsNumber"
        :max-pages="5"
        :ellipses="false"
        @update:model-value="getData(current)"
        :boundary-numbers="false"
      />
    </template>
  </q-table>
</template>

<script>
// import { Icon } from '@iconify/vue'
import Reject from 'src/components/RejectBtn.vue';
import Approve from 'src/components/ApproveBtn.vue';
import api from 'src/AxiosInterceptors';
import { ref } from 'vue';

export default {
  components: {
    // Icon,
    Reject,
    Approve,
  },
  setup() {
    const column = [
      {
        name: 'id',
        label: 'ID',
        align: 'center',
        field: 'id',
        style: 'width: 80px;',
      },
      {
        name: 'name',
        label: 'Name',
        align: 'center',
        field: 'name',

        style: 'width: 150px;',
      },
      {
        name: 'type',
        label: 'Type',
        align: 'center',
        field: 'type',
        style: 'width: 150px;',
      },
      {
        name: 'start',
        label: 'Start Leave',
        align: 'center',
        field: 'start',
        style: 'width: 250px;',
      },
      {
        name: 'end',
        label: 'End Leave',
        align: 'center',
        field: 'end',
        style: 'width: 100px;',
      },
      {
        name: 'amountleave',
        label: 'Amount of Leave',
        align: 'center',
        field: 'leaveUse',
      },
      {
        name: 'status',
        label: 'Status',
        align: 'center',
        field: 'statust',
      },
      {
        name: 'reason',
        label: 'Reason',
        align: 'center',
        field: 'reason',
      },
      {
        name: 'action',
        label: 'Action',
        align: 'center',
        field: 'action',
      },
    ];

    return {
      column,
      current: ref(1),
    };
  },
  data() {
    return {
      search: '',
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
        .get(`/leave/all?page=${page}&perPage=10`, {
          params: { search: this.search },
          withCredentials: true,
        })
        .then((resp) => {
          this.data = resp.data.data;
          this.pagination.rowsNumber = resp.data.meta.lastPage;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    formatDate(dateString) {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-UK', options);
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
