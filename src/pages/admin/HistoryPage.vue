<template>
  <h1 class="mx-4 md:text-3xl text-xl font-bold text-start">
    Name: {{ name }}
  </h1>
  <h3 class="mx-4 md:text-2xl text-lg font-semibold text-start">
    NIK: {{ nik }}
  </h3>

  <q-table
    class="my-table table-rounded"
    flat
    :columns="column"
    :rows="data"
    v-model:pagination="pagination"
    hide-bottom
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
            'bg-[#FBE7E8] text-[#A30D11] ': props.row.status === 'REJECT',
            'bg-[#FEF2E5] text-[#CD6200] ': props.row.status === 'WAITING',
          }"
        >
          <p class="font-semibold">{{ props.row.status }}</p>
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
</template>

<script lang="ts">
// import { Icon } from '@iconify/vue'
import { ref } from 'vue';
import api from 'src/AxiosInterceptors';
// import moment from 'moment';
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
        label: 'Leave Used',
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
    ];

    const route = useRoute();
    // TO GET ID FROM ROUTE
    const id = route.params.id;
    return {
      column,
      id,
      current: ref(1),
    };
  },
  mounted() {
    // TO GET DATA
    this.getData(this.pagination.page);
  },
  data() {
    return {
      filter: '',
      name: '',
      nik: '',
      // FOR DATA FROM API
      data: [],
      // FOR PAGINATION
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
    };
  },
  methods: {
    // TO GET DATA
    async getData(page: number | undefined) {
      await api
        .get(`/leave/history/${this.id}?page=${page}&perPage=10`, {
          withCredentials: true,
        })
        .then((resp) => {
          this.data = resp.data.data;
          this.name = resp.data.data[0].name;
          this.nik = resp.data.data[0].nik;
          this.pagination.rowsNumber = resp.data.meta.lastPage;
          console.log(resp);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // TO FORMAT DATE
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
