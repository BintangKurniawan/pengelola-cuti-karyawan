<template>
  <h1 class="mx-4 md:text-3xl text-xl font-bold text-start">
    Name: {{ name }}
  </h1>
  <h3 class="mx-4 md:text-2xl text-lg font-semibold text-start">
    NIK: {{ nik }}
  </h3>

  <q-table class="my-table table-rounded" flat :columns="column" :rows="data">
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
    <template v-slot:body-cell-status="props">
      <q-td class="text-center" :props="props">
        <div
          class="w-fill rounded-3xl px-3 py-2"
          :class="{
            'bg-[#EBF9F1] text-[#1F9254] ': props.row.status === 'APPROVE',
            'bg-[#FBE7E8] text-[#A30D11] ': props.row.status === 'Reject',
            'bg-[#FEF2E5] text-[#CD6200] ': props.row.status === 'WAITING',
          }"
        >
          <p class="font-semibold">{{ props.row.status }}</p>
        </div>
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
// import { Icon } from '@iconify/vue'
import Reject from 'src/components/RejectBtn.vue';
import Approve from 'src/components/ApproveBtn.vue';
import api from 'src/AxiosInterceptors';
import moment from 'moment';
import { useRoute } from 'vue-router';
export default {
  components: {
    // Icon,
  },
  setup() {
    const column = [
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
        field: 'amountOfLeave',
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

    const route = useRoute();

    const id = route.params.id;
    return {
      column,
      id,
    };
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      filter: '',
      name: '',
      nik: '',
      data: [],
    };
  },
  methods: {
    async getData() {
      await api
        .get(`/leave/history/${this.id}`, { withCredentials: true })
        .then((resp) => {
          this.data = resp.data.data;
          this.name = resp.data.data[0].employee.name;
          this.nik = resp.data.data[0].employee.nik;
          console.log(resp);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    formatDate(dateString: string | number | Date) {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-UK', options);
      // return moment(dateString).format('ll');
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
