<template>
  <h1 class="mx-4 md:text-3xl text-xl font-bold text-start">Name: Mang Jack</h1>
  <h3 class="mx-4 md:text-2xl text-lg font-semibold text-start">
    NIK: 1234567891011
  </h3>

  <q-table
    class="my-table table-rounded"
    flat
    :columns="column"
    :rows="filteredData"
  >
    <template v-slot:top-left>
      <div class="px-2 rounded-lg border-2 border-secondary">
        <q-input
          borderless
          dense
          v-model="filter"
          debounce="300"
          input-class="placeholder-color text-black"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" class="text-black" />
          </template>
        </q-input>
      </div>
    </template>

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
    <template v-slot:body-cell-action="props">
      <q-td :props="props" class="flex gap-1 justify-center items-center">
        <div
          v-if="props.row.status === 'Reject' || props.row.status === 'Waiting'"
        >
          <Approve status1="Reject" status2="Waiting" />
        </div>
        <div
          v-if="
            props.row.status === 'Approved' || props.row.status === 'Waiting'
          "
        >
          <Reject status1="Approved" status2="Waiting" />
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script>
// import { Icon } from '@iconify/vue'
import Reject from 'src/components/RejectBtn.vue';
import Approve from 'src/components/ApproveBtn.vue';
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
        style: 'width: 160px;',
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
    ];

    const rows = [
      {
        id: '#12345',
        name: 'Cristiano',
        type: 'Mandatory',
        amountleave: 1,
        start: '13 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Approved',
      },
      {
        id: '#12346',
        name: 'Alexis',
        type: 'Personal',
        amountleave: 1,
        start: '13 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Reject',
      },
      {
        id: '#12345',
        name: 'Dominic',
        type: 'Mandatory',
        amountleave: 1,
        start: '13 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Approved',
      },
      {
        id: '#12345',
        name: 'Dominic',
        type: 'Personal',
        amountleave: 1,
        start: '13 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Reject',
      },
      {
        id: '#12345',
        name: 'Fernando',
        type: 'Optional',
        amountleave: 1,
        start: '13 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Waiting',
      },
      {
        id: '#12345',
        name: 'Higuain',
        type: 'Optional',
        amountleave: 1,
        start: '13 May 2022',
        end: '13 May 2022',
        reason: 'vacation',
        status: 'Waiting',
      },
    ];
    return {
      column,
      rows,
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
  computed: {
    filteredData() {
      const lowCase = this.filter.toLowerCase();
      return this.rows.filter(
        (item) =>
          item.name.toLowerCase().includes(lowCase) ||
          item.type.toLowerCase().includes(lowCase)
      );
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
</style>
