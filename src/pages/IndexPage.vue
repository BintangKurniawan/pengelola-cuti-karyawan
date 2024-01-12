<template>
  <q-table
    class="my-table table-rounded"
    flat
    :columns="column"
    :rows="rows"
    v-model:pagination="pagination"
  >
    <template v-slot:body-cell-status="props">
      <q-td class="text-center" :props="props">
        <div
          class="w-fill rounded-3xl px-3 py-2"
          :class="{
            'bg-[#EBF9F1] text-[#1F9254] ': props.row.status === 'Approved',
            'bg-[#FBE7E8] text-[#A30D11] ': props.row.status === 'Reject',
            'bg-[#FEF2E5] text-[#CD6200] ': props.row.status === 'Waiting',
          }"
        >
          <p class="font-semibold">{{ props.row.status }}</p>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { Icon } from '@iconify/vue';
import { ref } from 'vue';

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
        field: 'start',
        style: 'width: 250px;',
        sortable: true,
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
        field: 'amountleave',
      },

      {
        name: 'reason',
        label: 'Reason',
        align: 'center',
        field: 'reason',
        style: 'width: 400px',
      },
    ];

    const rows = [
      {
        type: 'Mandatory',
        amountleave: 1,
        start: '13 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Approved',
      },
      {
        type: 'Personal',
        amountleave: 2,
        start: '11 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Reject',
      },
      {
        type: 'Mandatory',
        amountleave: 1,
        start: '14 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Approved',
      },
      {
        type: 'Personal',
        amountleave: 1,
        start: '12 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Reject',
      },
      {
        type: 'Optional',
        amountleave: 1,
        start: '15 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Waiting',
      },
      {
        type: 'Optional',
        amountleave: 1,
        start: '16 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Waiting',
      },
    ];

    const pagination = ref({
      sortBy: 'start',
      descending: false,
      page: 1,
      rowsPerPage: 5,
    });
    return {
      column,
      rows,
      pagination,
    };
  },
  data() {
    return {
      filter: '',
    };
  },
  methods: {
    tes(nik) {
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
