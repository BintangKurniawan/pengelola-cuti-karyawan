<template>
  <q-table
    class="my-table table-rounded"
    flat
    :loading="load"
    :columns="column"
    :rows="data"
    v-model:pagination="pagination"
    hide-pagination
  >
    <template v-slot:top-left>
      <div class="flex items-center gap-2">
        <div class="px-2 rounded-lg border-2 border-secondary">
          <!-- SEARCH -->
          <q-input
            borderless
            dense
            class="w-[160px]"
            v-model="searchQuery"
            debounce="700"
            @update:model-value="getData(pagination.page, sort)"
            input-class="placeholder-color text-black"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" class="text-black" />
            </template>
          </q-input>
        </div>
        <div class="flex items-center">
          <!-- FILTER -->
          <q-select
            class="rounded-lg w-[110px]"
            outlined
            v-model="status"
            :options="statusOptions"
            @update:model-value="updateStatus"
            label="Filter"
          ></q-select>
          <Icon
            @click="reset"
            v-if="status"
            icon="mdi:close-outline"
            width="24"
            class="text-negative cursor-pointer"
          />
        </div>
      </div>
    </template>
    <template v-slot:top-right>
      <div
        class="flex items-center md:justify-center md:gap-2 gap-1 md:mt-0 mt-4"
      >
        <SetCollective />
        <AddEmployee />
      </div>
    </template>
    <!-- ASC DESC NAME -->
    <template v-slot:header-cell-name="props">
      <q-th :props="props">
        <p @click="toggleSort" class="cursor-pointer">
          {{ props.col.label }}
        </p>
      </q-th>
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
  </q-table>
  <div class="row justify-center" v-if="pagination.rowsNumber > 1">
    <q-pagination
      v-model="current"
      color="primary"
      :max="pagination.rowsNumber"
      :max-pages="5"
      @update:model-value="getData(current, sort)"
      :boundary-numbers="false"
      direction-links
      boundary-links
    />
    <!-- :ellipses="false" -->
  </div>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import SetCollective from '../../components/SetCollectiveBtn.vue';
import AddEmployee from 'src/components/AddEmployee.vue';
import SetLeave from 'src/components/SetLeaveBtn.vue';
import Delete from 'src/components/DeleteBtn.vue';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
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

    const $q = useQuasar();
    return {
      column,
      current: ref(1),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      failedNotif(msg: any) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'negative',
          multiLine: true,
          actions: [
            {
              label: 'Refresh',
              color: 'white',
              handler: () => {
                document.location.reload();
              },
            },
          ],
        });
      },
    };
  },
  data() {
    return {
      // FOR SEARCH
      searchQuery: '',
      // FOR FILTER
      // filter: '',
      load: false,
      // FOR PAGINATION
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },

      // TO RECEIVED DATA FROM API
      data: [],

      // FOR SORT ASC DESC
      sort: ref(false),

      // TO RECEIVE SELECTED DATA FROM Q-SELECT
      status: null,
      // STATUS FOR SELECT
      statusOptions: [
        { value: true, label: 'Active' },
        { value: false, label: 'Resign' },
      ],
      // TO GET TRUE OR FALSE FROM SELECTED STATUS
      statusWork: null,
    };
  },
  mounted() {
    // TO GET DATA
    this.getData(this.pagination.page, this.sort);
  },
  methods: {
    // TO REMOVE FILTER
    reset() {
      this.statusWork = null;
      this.status = null;
      this.getData(this.pagination.page, this.sort);
    },
    // FOR ASC DESC
    toggleSort() {
      this.sort = !this.sort;
      this.getData(this.pagination.page, this.sort);
    },

    // TO GET DATA
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getData(page: number | undefined, sort: any) {
      this.load = true;
      const perPage = window.innerWidth >= 768 ? 10 : 8;
      const orderBy = `name_${sort ? 'desc' : 'asc'}`;
      await api
        .get(`/employee?page=${page}&perPage=${perPage}&orderBy=${orderBy}`, {
          params: {
            search: this.searchQuery,
            isWorking: this.statusWork,
          },
          withCredentials: true,
        })
        .then((res) => {
          this.data = res.data.data;
          this.pagination.rowsNumber = res.data.meta.lastPage;
          console.log(this.data);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });

      this.load = false;
    },

    // TO FILTER BY STATUS, IS ACTIVE OR RESIGN
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateStatus() {
      this.statusWork = this.status.value;
      this.getData(this.pagination.page, this.sort);
      console.log(this.statusWork);
    },

    // TO GET ACTIVE/ RESIGN TEXT FROM API
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
