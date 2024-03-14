<template>
  <q-table
    class="my-table table-rounded hide-scroll mx-4"
    flat
    :loading="load"
    :columns="column"
    :rows="data"
    v-model:pagination="pagination"
    hide-pagination
  >
    <template v-slot:top-left>
      <div class="flex items-center gap-2">
        <Icon
          icon="mdi:sync-circle"
          width="36"
          @click="async"
          class="text-primary cursor-pointer"
        />

        <div class="px-2 rounded-lg border-2 border-secondary">
          <!-- SEARCH -->
          <q-input
            borderless
            dense
            class="w-[160px]"
            v-model="searchQuery"
            debounce="700"
            clear-icon="close"
            @update:model-value="search"
            input-class="placeholder-color text-black"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon
                v-if="searchQuery !== ''"
                name="close"
                @click="clearSearch"
                class="cursor-pointer"
              />
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

          <q-icon
            @click="reset"
            v-if="status"
            size="16px"
            name="close"
            class="cursor-pointer"
          />
        </div>
        <div class="flex items-center">
          <!-- FILTER -->
          <q-select
            class="rounded-lg w-[130px]"
            outlined
            v-model="positionStatus"
            :options="positionOptions"
            @update:model-value="updateStatus2"
            label="Position"
          ></q-select>

          <q-icon
            @click="reset2"
            v-if="positionStatus"
            size="16px"
            name="close"
            class="cursor-pointer"
          />
        </div>
        <div class="flex items-center">
          <!-- FILTER -->
          <q-select
            class="rounded-lg w-[130px]"
            outlined
            v-model="amountType"
            :options="amountTypeOptions"
            @update:model-value="updateStatus3"
            label="Amount"
          ></q-select>

          <q-icon
            @click="reset3"
            v-if="amountType"
            size="16px"
            name="close"
            class="cursor-pointer"
          />
        </div>
      </div>
    </template>
    <!-- taro v if lagi nanti di sini -->
    <!-- sementara done -->
    <template v-slot:top-right>
      <div
        class="flex items-center md:justify-center md:gap-2 gap-1 md:mt-0 mt-4"
      >
        <SetCollective v-if="permissions.includes('Create Collective Leave')" />
        <AddEmployee
          @get-data="handleChildEvent"
          v-if="permissions.includes('Add Employee')"
        />
      </div>
    </template>
    <template v-slot:header-cell-nik="props">
      <q-th :props="props">
        <p @click="toggleSort('nik')" class="cursor-pointer">
          {{ props.col.label }}
          <q-icon
            v-if="sortLabel === 'nik'"
            :name="sort ? 'arrow_upward' : 'arrow_downward'"
            size="1.5em"
          />
        </p>
      </q-th>
    </template>
    <!-- ASC DESC NAME -->
    <template v-slot:header-cell-name="props">
      <q-th :props="props">
        <p @click="toggleSort('name')" class="cursor-pointer">
          {{ props.col.label }}

          <q-icon
            v-if="sortLabel === 'name'"
            :name="sort ? 'arrow_upward' : 'arrow_downward'"
            size="1.5em"
          />
        </p>
      </q-th>
    </template>
    <template v-slot:header-cell-amountOfLeaveNow="props">
      <q-th :props="props">
        <p>{{ thisYear }} Leave</p>
      </q-th>
    </template>
    <template v-slot:header-cell-amountOfLeaveThen="props">
      <q-th :props="props">
        <p>{{ lastYear }} Leave</p>
      </q-th>
    </template>

    <!-- taro v if lagi di sini -->
    <!-- sementara done -->
    <template v-slot:header-cell-setleave="props">
      <q-th :props="props" v-if="permissions.includes('Create Personal Leave')">
        <p>{{ props.col.label }}</p>
      </q-th>
    </template>
    <template v-slot:body-cell-position="props">
      <q-td class="text-center" :props="props">
        <div class="w-fill rounded-3xl px-3 py-2">
          <p class="font-semibold">{{ props.row.positions.name }}</p>
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-amountOfLeaveNow="props">
      <q-td class="text-center" :props="props">
        <div class="w-fill rounded-3xl px-3 py-2">
          <p class="font-semibold">
            {{ props.row.amountOfLeave[0].amount }}
          </p>
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-amountOfLeaveThen="props">
      <q-td class="text-center" :props="props">
        <div
          class="w-fill rounded-3xl px-3 py-2"
          v-if="props.row.amountOfLeave.length > 1"
        >
          <p class="font-semibold">{{ props.row.amountOfLeave[1].amount }}</p>
        </div>
        <div class="w-fill rounded-3xl px-3 py-2" v-else>
          <p class="font-semibold">0</p>
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
      <!-- taro v if lagi di sini -->
      <!-- sementara done -->
      <q-td :props="props" v-if="permissions.includes('Create Personal Leave')">
        <div v-if="props.row.isWorking === true">
          <SetLeave :id="props.row.nik" page="dashboard" text="Set" />
        </div>
        <div v-else>
          <p>-</p>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-action="props">
      <q-td :props="props" class="flex items-center justify-center">
        <AdjustLeaveBtn
          :id="props.row.nik"
          @get-data="handleChildEvent"
          v-if="
            props.row.isWorking === true &&
            props.row.amountOfLeave[0].amount < 0 &&
            permissions.includes('Adjust Leave')
          "
        />
        <q-btn
          flat
          text-color="white"
          class=""
          @click="goToDetail(props.row.nik)"
        >
          <Icon
            icon="mdi:information-outline"
            width="24"
            class="text-primary"
          />
        </q-btn>
        <!-- taro v if lagi di sini -->
        <!-- sementara done -->
        <q-btn
          v-if="permissions.includes('View Leave History by Employee NIK')"
          flat
          text-color="white"
          class=""
          @click="goToHistory(props.row.nik)"
        >
          <Icon icon="mdi:history" width="24" class="text-dark" />
        </q-btn>
        <!-- taro v if lagi di sini -->
        <!-- sementara done -->
        <Delete
          :id="props.row.nik"
          @get-data="handleChildEvent"
          v-if="
            permissions.includes('Disable Employee') &&
            props.row.isWorking === true
          "
        />
      </q-td>
    </template>
  </q-table>
  <div class="row justify-center mt-4" v-if="pagination.rowsNumber > 1">
    <q-pagination
      v-model="current"
      color="primary"
      :max="pagination.rowsNumber"
      :max-pages="5"
      @update:model-value="paginate"
      :boundary-numbers="false"
      direction-links
      boundary-links
    />
  </div>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import SetCollective from '../../components/Set_Components/SetCollectiveBtn.vue';
import AddEmployee from 'src/components/Add_Components/AddEmployee.vue';
import SetLeave from 'src/components/Set_Components/SetLeaveBtn.vue';
import Delete from 'src/components/Delete_Components/DeleteBtn.vue';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
import AdjustLeaveBtn from 'src/components/AdjustLeaveBtn.vue';
import { usePermissionStore } from 'src/stores/permissionStore';
export default {
  components: {
    SetCollective,
    Icon,
    SetLeave,
    Delete,
    AddEmployee,
    AdjustLeaveBtn,
  },
  setup() {
    const column = [
      {
        name: 'nik',
        label: 'NIK',
        align: 'center',
        field: 'nik',
      },
      {
        name: 'name',
        label: 'Name',
        align: 'center',
        field: 'name',
        style: 'width: 100px;',
      },
      {
        name: 'position',
        label: 'Position',
        align: 'center',
        field: 'position',
        style: 'width: 300px;',
      },
      {
        name: 'gender',
        label: 'Gender',
        align: 'center',
        field: 'gender',
      },
      {
        name: 'amountOfLeaveNow',
        label: 'This Year Leave',
        align: 'center',
        field: 'amountOfLeaveNow',
        style: 'width: 250px;',
      },
      {
        name: 'amountOfLeaveThen',
        label: 'Last Year Leave',
        align: 'center',
        field: 'amountOfLeaveThen',
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
        style: 'width: 260px',
      },
    ];
    const perm = usePermissionStore();
    const roleId = localStorage.getItem('role');
    const $q = useQuasar();
    const permissions = perm.getPerm;

    console.log(permissions);

    return {
      permissions,
      roleId,
      column,
      current: ref(1),
      successNotif(msg: any) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'primary',
          multiLine: true,
        });
      },
      failedNotif(msg: any) {
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
      thisYear: new Date().getFullYear(),
      lastYear: new Date().getFullYear() - 1,
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
      sortLabel: 'name',

      // TO RECEIVE SELECTED DATA FROM Q-SELECT
      status: null,
      // STATUS FOR SELECT
      statusOptions: [
        { value: true, label: 'Active' },
        { value: false, label: 'Resign' },
      ],
      // TO GET TRUE OR FALSE FROM SELECTED STATUS
      statusWork: null,
      curentPageRes: 0,
      position: '',

      positionOptions: [],
      positionStatus: null,

      amountType: '',
      amountTypeOptions: ['Negative'],
    };
  },
  mounted() {
    this.getPosition();

    // TO GET THE SPECIFIC PAGE WHEN RETURN FROM DETAIL
    const currentPage = this.$route.query.page || 1;
    this.current = parseInt(currentPage);
    const searchq = this.$route.query.search || '';
    this.searchQuery = searchq;
    const getPosition = this.$route.query.position || '';
    this.position = getPosition;
    this.positionStatus = getPosition;
    // TO GET DATA
    this.getData(
      currentPage,
      this.sort,
      this.sortLabel,
      searchq,
      this.position
    );
  },
  methods: {
    handleChildEvent() {
      this.getData(
        this.current,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
    },
    // PAGINATE
    paginate() {
      this.$router.push({ query: { page: this.current } });
      this.getData(
        this.current,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
    },
    goToDetail(nik: any) {
      this.$router.push({
        path: `/admin/detail/${nik}`,
        query: { page: this.current },
      });
    },
    goToHistory(nik: any) {
      this.$router.push({
        path: `/admin/history/${nik}`,
        query: { page: this.current },
      });
    },
    // TO REMOVE FILTER
    reset() {
      this.statusWork = null;
      this.status = null;
      this.current = 1;
      this.$router.push({ query: { page: this.current } });

      this.getData(
        this.current,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
    },
    reset2() {
      this.current = 1;
      this.position = '';
      this.positionStatus = null;
      this.$router.push({ query: { page: this.current } });

      this.getData(
        this.current,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
    },
    reset3() {
      this.current = 1;
      this.position = '';
      this.amountType = '';
      this.positionStatus = null;
      this.$router.push({ query: { page: this.current } });

      this.getData(
        this.current,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
    },
    clearSearch() {
      this.searchQuery = '';
      this.$router.push({ query: { search: this.searchQuery } });

      this.getData(
        this.pagination.page,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
    },
    // FOR ASC DESC
    toggleSort(label: any) {
      this.sortLabel = label;
      this.sort = !this.sort;
      this.current = 1;
      this.getData(
        this.pagination.page,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
    },
    search() {
      this.getData(
        this.pagination.page,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
      this.$router.push({ query: { search: this.searchQuery } });
    },
    async getPosition() {
      await api
        .get('/position/filter-leaves?page=1&perPage=100')
        .then((resp) => {
          const positions = resp.data.data;
          const mappedPositions = positions.map(
            (position: { id: any; name: any }) => {
              return {
                value: position.id,
                label: position.name,
              };
            }
          );

          this.positionOptions = mappedPositions;
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
          if (err.response.status === 403) {
            this.$router.push('/forbidden');
          }
        });
    },
    // TO GET DATA
    async getData(
      page: number | undefined,
      sort: any,
      label: any,
      search: any,
      position: any
    ) {
      this.load = true;
      const perPage = window.innerWidth >= 768 ? 10 : 7;
      const orderBy = `${label}_${sort ? 'desc' : 'asc'}`;
      await api
        .get(
          `/employee?page=${page}&perPage=${perPage}&orderBy=${orderBy}&sortBy=${sort}&search=${search}&position=${position}`,
          {
            params: {
              isWorking: this.statusWork,
              amountType: this.amountType.toLocaleLowerCase(),
            },
          }
        )
        .then((res) => {
          this.data = res.data.data;
          this.pagination.rowsNumber = res.data.meta.lastPage;
          this.curentPageRes = res.data.meta.currPage;
          console.log(this.data);
          this.load = false;
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },

    // TO CHECK THE FIELD IN BACKEND, THEY TOLD ME TO WRITE THIS
    async async() {
      await api
        .post('/employee/update-amount-of-leave', {})
        .then((res) => {
          const msg = res.data.message;
          this.successNotif(msg);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
    // TO FILTER BY STATUS, IS ACTIVE OR RESIGN
    updateStatus() {
      this.statusWork = this.status.value;
      this.current = 1;

      this.getData(
        this.pagination.page,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
      this.$router.push({ query: { page: this.curentPageRes } });
      console.log(this.statusWork);
    },
    updateStatus2() {
      this.position = this.positionStatus.label;
      this.current = 1;

      this.getData(
        this.pagination.page,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
      this.$router.push({ query: { page: this.curentPageRes } });
      console.log(this.statusWork);
    },

    updateStatus3() {
      this.current = 1;

      this.getData(
        this.pagination.page,
        this.sort,
        this.sortLabel,
        this.searchQuery,
        this.position
      );
      this.$router.push({ query: { page: this.curentPageRes } });
    },

    // TO GET ACTIVE/ RESIGN TEXT FROM API
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
.hide-scroll::-webkit-scrollbar-track {
  box-shadow: none !important;
}
</style>
