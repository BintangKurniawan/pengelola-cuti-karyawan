<template>
  <q-table
    class="my-table table-rounded"
    flat
    :columns="column"
    :rows="data"
    v-model:pagination="pagination"
  >
    <template v-slot:top-left>
      <div class="px-2 rounded-lg border-2 border-secondary">
        <q-input
          borderless
          dense
          v-model="searchQuery"
          debounce="400"
          @update:model-value="getData(pagination.page)"
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
      <div class="flex items-center md:justify-center gap-2 md:mt-0 mt-4">
        <SetCollective />
        <AddEmployee />
      </div>
    </template>
    <template v-slot:body-cell-position="props">
      <q-td class="text-center" :props="props">
        <div class="w-fill rounded-3xl px-3 py-2">
          <p class="font-semibold">{{ props.row.positions.name }}</p>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-status="props">
      <q-td class="text-center" :props="props">
        <div
          class="w-fill rounded-3xl px-3 py-2"
          :class="{
            'bg-[#EBF9F1] text-[#1F9254] ': props.row.isWorking === true,
            'bg-[#FBE7E8] text-[#A30D11] ': props.row.isWorking === false,
          }"
        >
          <p class="font-semibold">{{ getStatusText(props.row.isWorking) }}</p>
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
        <SetLeave :id="props.row.nik" />
      </q-td>
    </template>
    <template v-slot:body-cell-action="props">
      <q-td :props="props">
        <q-btn
          flat
          text-color="white"
          class=""
          @click="$router.push(`/admin/detail/${props.row.nik}`)"
        >
          <Icon icon="mdi:information-outline" width="24" class="text-info" />
        </q-btn>
        <q-btn
          flat
          text-color="white"
          class=""
          @click="$router.push(`/admin/history/${props.row.nik}`)"
        >
          <Icon icon="mdi:history" width="24" class="text-dark" />
        </q-btn>
        <Delete :id="props.row.nik" />
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
      },
      {
        name: 'name',
        label: 'Name',
        align: 'center',
        field: 'name',

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
        name: 'amountOfLeave',
        label: 'Remaining Leave',
        align: 'center',
        field: 'amountOfLeave',
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

    return {
      column,
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
      data: [],
    };
  },
  mounted() {
    this.getData(this.pagination.page);
  },
  methods: {
    async getData(page: number | undefined) {
      try {
        await api
          .get(`/employee?page=${page}&perPage=10`, {
            params: { search: this.searchQuery },
            withCredentials: true,
          })
          .then((res) => {
            this.data = res.data.data;
            this.pagination.rowsNumber = res.data.meta.lastPage;
            console.log(this.data);
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
