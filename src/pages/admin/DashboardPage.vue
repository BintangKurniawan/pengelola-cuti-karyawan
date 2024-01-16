<template>
  <q-table
    class="my-table table-rounded"
    flat
    :columns="column"
    :rows="filteredData"
    v-model:pagination="pagination"
  >
    <template v-slot:top-left>
      <div class="px-2 rounded-lg border-2 border-secondary">
        <q-input
          borderless
          dense
          v-model="searchQuery"
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
    <template v-slot:top-right>
      <div class="flex items-center justify-center gap-2 md:mt-0 mt-4">
        <SetCollective />
        <AddEmployee />
      </div>
    </template>

    <template v-slot:body-cell-status="props">
      <q-td class="text-center" :props="props">
        <div
          class="w-fill rounded-3xl px-3 py-2"
          :class="{
            'bg-[#EBF9F1] text-[#1F9254] ': props.row.status === true,
            'bg-[#FBE7E8] text-[#A30D11] ': props.row.status === false,
          }"
        >
          <p class="font-semibold">{{ getStatusText(props.row.status) }}</p>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-setleave="props">
      <q-td :props="props">
        <!-- <q-btn
          color="primary"
          text-color="white"
          label="Set"
          class="capitalize rounded-3xl"
          :onClick="() => tes(props.row.nik)" /> -->
        <SetLeave />
      </q-td>
    </template>
    <template v-slot:body-cell-action="props">
      <q-td :props="props">
        <q-btn
          flat
          text-color="white"
          class=""
          @click="$router.push('/admin/detail')"
        >
          <Icon icon="mdi:information-outline" width="24" class="text-info" />
        </q-btn>
        <q-btn
          flat
          text-color="white"
          class=""
          @click="$router.push('/admin/history')"
        >
          <Icon icon="mdi:history" width="24" class="text-dark" />
        </q-btn>
        <Delete />
      </q-td>
    </template>
  </q-table>
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

<script lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import SetCollective from '../../components/SetCollectiveBtn.vue';
import AddEmployee from 'src/components/AddEmployee.vue';
import SetLeave from 'src/components/SetLeaveBtn.vue';
import Delete from 'src/components/DeleteBtn.vue';
import api from 'src/AxiosInterceptors';
export default {
  components: {
    SetCollective,
    Icon,
    SetLeave,
    Delete,
    AddEmployee,
  },
  setup() {
    const column = [
      {
        name: 'nik',
        label: 'NIK',
        align: 'center',
        field: 'nik',
        style: 'width: 160px;',
        sortable: true,
      },
      {
        name: 'name',
        label: 'Name',
        align: 'center',
        field: 'name',
        sortable: true,
        style: 'width: 300px;',
      },
      {
        name: 'position',
        label: 'Position',
        align: 'center',
        field: 'position',
        style: 'width: 300px;',
      },
      {
        name: 'remainingleave',
        label: 'Remaining Leave',
        align: 'center',
        field: 'remainingleave',
        style: 'width: 250px;',
      },
      {
        name: 'status',
        label: 'Status',
        align: 'center',
        field: 'statust',
        style: 'width: 100px;',
      },
      {
        name: 'setleave',
        label: 'Set Leave',
        align: 'center',
        field: 'setleave',
      },
      {
        name: 'action',
        label: 'Action',
        align: 'center',
        field: 'action',
        style: 'width: 100px',
      },
    ];

    const rows = [
      {
        nik: 12345,
        name: 'Cristiano',
        position: 'Manager',
        remainingleave: 1,
        status: true,
      },
      {
        nik: 12346,
        name: 'Alexis',
        position: 'CEO',
        remainingleave: 5,
        status: true,
      },
      {
        nik: 12347,
        name: 'Dominic',
        position: 'Employee',
        remainingleave: 1,
        status: true,
      },
      {
        nik: 12348,
        name: 'Bernardo',
        position: '-',
        remainingleave: 0,
        status: false,
      },
      {
        nik: 12349,
        name: 'Fernando',
        position: 'HR',
        remainingleave: 7,
        status: true,
      },
      {
        nik: 12350,
        name: 'Higuain',
        position: 'HR',
        remainingleave: 3,
        status: true,
      },
      {
        nik: 12351,
        name: 'Darwin',
        position: 'HR',
        remainingleave: 3,
        status: true,
      },
      {
        nik: 12352,
        name: 'Luis',
        position: 'HR',
        remainingleave: 3,
        status: true,
      },
      {
        nik: 12353,
        name: 'Andrew',
        position: 'HR',
        remainingleave: 3,
        status: true,
      },
      {
        nik: 12354,
        name: 'Virgil',
        position: 'HR',
        remainingleave: 3,
        status: true,
      },
      {
        nik: 12355,
        name: 'Trent',
        position: 'HR',
        remainingleave: 3,
        status: true,
      },
    ];

    return {
      column,
      rows,
      current: ref(1),
    };
  },
  data() {
    return {
      searchQuery: '',
      filter: '',
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
    };
  },
  methods: {
    async getData(page: number | undefined) {
      try {
        await api
          .get(`/employee?page=${page}`, {
            params: { search: this.searchQuery },
            withCredentials: true,
          })
          .then((res) => {
            console.log(res);
          });
      } catch (err) {
        console.error(err);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tes(nik: any) {
      console.log(nik);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getStatusText(status: any) {
      return status ? 'Active' : 'Resign';
    },
  },
  computed: {
    filteredData() {
      const lowCase = this.filter.toLowerCase();
      return this.rows.filter(
        (item) =>
          item.name.toLowerCase().includes(lowCase) ||
          item.position.toLowerCase().includes(lowCase)
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
