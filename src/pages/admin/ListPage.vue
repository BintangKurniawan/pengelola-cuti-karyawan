<template>
  <q-table
    class="my-table table-rounded"
    flat
    :loading="load"
    :columns="column"
    :rows="data"
    hide-pagination
    v-model:pagination="pagination"
  >
    <template v-slot:top-left>
      <div class="flex items-center gap-2">
        <div class="px-2 rounded-lg border-2 border-secondary">
          <q-input
            borderless
            dense
            class="w-[160px]"
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
        <div class="flex items-center">
          <q-select
            class="rounded-lg w-[110px]"
            outlined
            v-model="status"
            :options="statusOptions"
            @update:model-value="getData(pagination.page)"
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
        class="flex gap-1 justify-center items-center text-center w-custom"
      >
        <div
          v-if="
            (props.row.status === 'REJECT' || props.row.status === 'WAITING') &&
            props.row.typeOfLeave.name !== 'Optional'
          "
        >
          <Approve :id="props.row.leaveEmployeeId" />
        </div>
        <div
          v-if="
            (props.row.status === 'APPROVE' ||
              props.row.status === 'WAITING') &&
            props.row.typeOfLeave.name !== 'Mandatory'
          "
        >
          <Reject
            :type="props.row.typeOfLeave.name"
            :id="props.row.leaveEmployeeId"
          />
        </div>
      </q-td>
    </template>
  </q-table>
  <div class="row justify-center" v-if="pagination.rowsNumber > 1">
    <q-pagination
      v-model="current"
      color="primary"
      :max="pagination.rowsNumber"
      :max-pages="5"
      @update:model-value="getData(current)"
      :boundary-numbers="false"
      direction-links
      boundary-links
    />
  </div>

  <div v-if="roleId === '1'">
    <h1 class="text-center">You're not allowed to access this page</h1>
  </div>
</template>

<script>
// import { Icon } from '@iconify/vue'
import Reject from 'src/components/RejectBtn.vue';
import Approve from 'src/components/ApproveBtn.vue';
import api from 'src/AxiosInterceptors';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
export default {
  components: {
    Icon,
    Reject,
    Approve,
  },
  setup() {
    const roleId = localStorage.getItem('role');
    const column = [
      {
        name: 'id',
        label: 'NIK',
        align: 'center',
        field: 'nik',
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
      {
        name: 'action',
        label: 'Action',
        align: 'center',
        field: 'action',
      },
    ];

    return {
      roleId,
      column,
      current: ref(1),
    };
  },
  data() {
    return {
      load: false,
      search: '',
      data: [],
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
      // TO RECEIVED FILTER DATA FROM Q-SELECT
      status: '',
      // FOR FILTER DATA
      statusOptions: ['Approve', 'Waiting', 'Reject'],
    };
  },
  mounted() {
    // TO GET DATA
    this.getData(this.pagination.page);
  },
  methods: {
    // TO REMOVE FILTER
    reset() {
      this.status = '';
      this.current = 1;
      this.getData(this.pagination.page);
    },
    // TO GETD ATA
    async getData(page) {
      const perPage = window.innerWidth >= 768 ? 10 : 9;
      this.load = true;
      await api
        .get(`/leave/all?page=${page}&perPage=${perPage}`, {
          params: { search: this.search, status: this.status },
          withCredentials: true,
        })
        .then((resp) => {
          this.data = resp.data.data;
          this.pagination.rowsNumber = resp.data.meta.lastPage;
        })
        .catch((err) => {
          console.error(err);
          setInterval(() => {
            document.location.reload();
          }, 1000);
        });
      this.load = false;
    },
    // TO FORMAT DATE
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

@media (max-width: 768px) {
  .w-custom {
    width: 100px;
  }
}
</style>
