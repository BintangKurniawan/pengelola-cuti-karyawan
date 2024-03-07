<template>
  <div class="flex items-center m-4 gap-4 justify-between">
    <div class="flex items-center gap-2">
      <div class="px-2 rounded-lg border-2 border-secondary">
        <q-input
          borderless
          dense
          class="md:w-[160px] w-[100px]"
          v-model="search"
          debounce="700"
          clearable
          clear-icon="close"
          input-class="placeholder-color text-black"
          @update:model-value="
            switchTable
              ? getData(pagination.page)
              : getDataSpecial(pagination.page)
          "
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" class="text-black" />
          </template>
        </q-input>
      </div>
      <div class="flex items-center gap-4 flex-row">
        <div class="flex items-center gap-1">
          <q-select
            class="rounded-lg w-[110px]"
            outlined
            v-model="status"
            :options="statusOptions"
            @update:model-value="
              switchTable
                ? getData(pagination.page)
                : getDataSpecial(pagination.page)
            "
            label="Status"
          >
          </q-select>
          <q-icon
            @click="resetStatus"
            v-if="status"
            size="16px"
            name="close"
            class="cursor-pointer"
          />
        </div>
        <div class="flex items-center gap-1" v-if="switchTable">
          <q-select
            class="rounded-lg w-[125px]"
            outlined
            v-model="typeLeave"
            :options="typeLeaveOptions"
            @update:model-value="getData(pagination.page)"
            label="Type"
          ></q-select>
          <q-icon
            @click="resetType"
            v-if="typeLeave"
            size="16px"
            name="close"
            class="cursor-pointer"
          />
        </div>
      </div>
    </div>
    <div class="w-full border-b-2 flex items-center justify-center gap-4">
      <div
        v-if="permissions.includes('View All Leave History')"
        class="cursor-pointer group relative transition-all"
        @click="toggleTable1"
        :class="{ 'text-primary font-semibold': switchTable }"
      >
        <span
          class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300"
          :class="switchTable ? 'w-full' : 'w-0'"
          >&nbsp;</span
        >
        Ordinary
      </div>
      <div
        v-if="permissions.includes('View All Employee Special Leaves')"
        class="cursor-pointer group relative transition-all"
        @click="toggleTable"
        :class="{ 'text-primary font-semibold': !switchTable }"
      >
        <span
          class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300"
          :class="!switchTable ? 'w-full' : 'w-0'"
          >&nbsp;</span
        >
        Special
      </div>
    </div>
  </div>
  <q-table
    class="my-table table-rounded mx-4"
    flat
    :loading="load"
    :columns="switchTable ? column : column2"
    :rows="switchTable ? data : specialData"
    hide-pagination
    v-model:pagination="pagination"
  >
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
      <q-td :props="props" class="flex justify-center items-center gap-1">
        <Approve
          v-if="
            (permissions.includes('Approve and Reject Personal Leave') &&
              (props.row.status === 'REJECT' ||
                props.row.status === 'WAITING') &&
              props.row.typeOfLeave.name === 'Personal') ||
            ((props.row.status === 'REJECT' ||
              props.row.status === 'WAITING') &&
              props.row.typeOfLeave.name === 'Special')
          "
          :type="switchTable ? 'personal' : 'employee-special-leave'"
          :id="switchTable ? props.row.leaveEmployeeId : props.row.id"
        />

        <Reject
          v-if="
            props.row.typeOfLeave.name !== 'Optional' &&
            (props.row.status === 'APPROVE' ||
              props.row.status === 'WAITING') &&
            props.row.typeOfLeave.name !== 'Mandatory' &&
            permissions.includes('Approve and Reject Personal Leave')
          "
          :type="switchTable ? 'personal' : 'employee-special-leave'"
          :id="switchTable ? props.row.leaveEmployeeId : props.row.id"
        />

        <Reject
          v-if="
            permissions.includes('Approve and Reject Special Leave') &&
            (props.row.status === 'APPROVE' ||
              props.row.status === 'WAITING') &&
            props.row.typeOfLeave.name !== 'Mandatory'
          "
          :type="'employee-special-leave'"
          :id="switchTable ? props.row.leaveEmployeeId : props.row.id"
        />
        <NoteBtn
          :note="props.row.note"
          :rejectBy="props.row.rejectBy"
          v-if="props.row.note != null && props.row.status === 'REJECT'"
        />
        <NoteBtn
          :approveBy="props.row.approveBy"
          v-if="props.row.status === 'APPROVE' && props.row.approveBy"
        />
      </q-td>
    </template>
  </q-table>
  <div
    class="row justify-center mt-4"
    v-if="pagination.rowsNumber > 1 && switchTable"
  >
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

  <div
    class="row justify-center mt-4"
    v-if="pagination.rowsNumberSpe > 1 && $route.query.type === 'Special'"
  >
    <q-pagination
      v-model="currentSpe"
      color="primary"
      :max="pagination.rowsNumberSpe"
      :max-pages="5"
      @update:model-value="getDataSpecial(currentSpe)"
      :boundary-numbers="false"
      direction-links
      boundary-links
    />
  </div>
</template>

<script>
import Reject from 'src/components/Negative_Components/RejectLeaveBtn.vue';
import Approve from 'src/components/Positive_Components/ApproveBtn.vue';
import api from 'src/AxiosInterceptors';
import { ref } from 'vue';
import NoteBtn from 'src/components/Display_Components/NoteBtn.vue';
import { useQuasar } from 'quasar';
export default {
  components: {
    Reject,
    Approve,
    NoteBtn,
  },
  setup() {
    const $q = useQuasar();
    const roleId = localStorage.getItem('role');
    const column = [
      {
        name: 'name',
        label: 'Name',
        align: 'center',
        field: 'name',
        style: 'width: 100px;',
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
      },

      {
        name: 'end',
        label: 'End Leave',
        align: 'center',
        field: 'end',
        style: 'width: 250px;',
      },
      {
        name: 'amountleave',
        label: 'Leave Used',
        align: 'center',
        field: 'leaveUse',
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
        style: 'width: 200px;',
      },

      // here
    ];

    const column2 = [
      {
        name: 'name',
        label: 'Name',
        align: 'center',
        field: 'name',

        style: 'width: 100px;',
      },

      {
        name: 'start',
        label: 'Start Leave',
        align: 'center',
        field: 'start',
      },
      {
        name: 'end',
        label: 'End Leave',
        align: 'center',
        field: 'end',
        style: 'width: 250px;',
      },
      {
        name: 'amount',
        label: 'Amount',
        align: 'center',
        field: 'amount',
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
        name: 'reason',
        label: 'Leave Title',
        align: 'center',
        field: 'leaveTitle',
      },
      {
        name: 'action',
        label: 'Action',
        align: 'center',
        field: 'action',
        style: 'width: 200px',
      },
    ];

    const permissions = JSON.parse(localStorage.getItem('permissions'));
    return {
      permissions,
      roleId,
      column,
      column2,
      current: ref(1),
      currentSpe: ref(1),
      failedNotif(msg) {
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
      load: false,
      search: '',
      data: [],
      specialData: [],
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
        rowsNumberSpe: 0,
      },
      // TO RECEIVED FILTER DATA FROM Q-SELECT
      status: '',
      switchTable: ref(true),
      // FOR FILTER DATA
      statusOptions: ['Approve', 'Waiting', 'Reject'],

      typeLeave: '',
      typeLeaveOptions: ['Mandatory', 'Optional', 'Personal'],
    };
  },
  mounted() {
    if (this.permissions.includes('View All Leave History')) {
      this.getData(this.pagination.page);
      this.switchTable = true;
    } else if (
      this.permissions.includes('View All Employee Special Leaves') ||
      this.$route.query.type === 'Special'
    ) {
      this.switchTable = false;
      this.getDataSpecial(this.pagination.page);
    }
    // FOR SPECIFIC TABLE WHEN REJECTED OR APPROVED THE LEAVE, SO IT'S STILL STAY IN THAT TABLE
    // if (this.$route.query.type === 'Special' || this.permissions.includes('View All Employee Special Leaves')) {
    //   this.switchTable = false;
    //   this.getDataSpecial(this.pagination.page);
    // } else {
    //   this.switchTable = true;
    //   this.getData(this.pagination.page);
    // }
    // TO GET DATA
    // this.getData(this.pagination.page);
  },
  methods: {
    clearSearch() {
      this.search = '';
      this.getData(this.pagination.page);
    },
    // TO REMOVE FILTER
    resetStatus() {
      this.status = '';
      this.current = 1;
      if (this.switchTable) {
        this.getData(this.pagination.page);
      } else {
        this.getDataSpecial(this.pagination.page);
      }
    },
    resetType() {
      this.current = 1;
      this.typeLeave = '';
      this.getData(this.pagination.page);
    },
    // SWITCH TABLE DATA
    toggleTable1() {
      this.switchTable = true;
      this.search = '';
      this.status = '';
      this.current = 1;
      this.$router.push({
        query: { type: this.switchTable ? 'Ordinary' : 'Special' },
      });
      this.getData(this.pagination.page);
    },
    // SWITCH TABLE DATA
    toggleTable() {
      this.switchTable = false;
      this.search = '';
      this.status = '';
      this.current = 1;
      this.$router.push({
        query: { type: this.switchTable ? 'Ordinary' : 'Special' },
      });

      this.getDataSpecial(this.pagination.page);
    },
    // TO GETD ATA
    async getData(page) {
      const perPage = window.innerWidth >= 768 ? 8 : 7;
      this.load = true;
      await api
        .get(`/leave/all?page=${page}&perPage=${perPage}`, {
          params: {
            search: this.search,
            status: this.status,
            typeOfLeave: this.typeLeave,
          },
        })
        .then((resp) => {
          this.data = resp.data.data;
          this.pagination.rowsNumber = resp.data.meta.lastPage;
        })
        .catch((err) => {
          console.error(err);
          // setInterval(() => {
          //   document.location.reload();
          // }, 1000);
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
      this.load = false;
    },

    async getDataSpecial(page) {
      const perPage = window.innerWidth >= 768 ? 8 : 7;

      await api
        .get(`/leave/employee-special-leaves?page=${page}&perPage=${perPage}`, {
          params: {
            search: this.search,
            status: this.status,
          },
        })
        .then((res) => {
          this.specialData = res.data.data;
          this.pagination.rowsNumberSpe = res.data.meta.lastPage;
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
          if (err.response.data.message) {
            this.failedNotif(err.response.data.message);
          }
        });
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

.w-custom {
  width: 100px;
}
</style>
