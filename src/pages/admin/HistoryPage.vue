<template>
  <q-btn
    dense
    flat
    @click="$router.back()"
    class="flex items-start w-full md:w-fit hover:bg-gray-100 p-4 text-black self-start"
  >
    <div class="flex items-center gap-4">
      <Icon icon="mdi:arrow-left-circle-outline" width="24" />
      <p class="capitalize">Back</p>
    </div>
  </q-btn>
  <h1
    class="mx-4 md:text-3xl text-xl font-bold text-start"
    v-if="data && data.length > 0"
  >
    Name: {{ name }}
  </h1>
  <h3
    class="mx-4 md:text-2xl text-lg font-semibold text-start"
    v-if="data && data.length > 0"
  >
    NIK: {{ nik }}
  </h3>

  <div class="flex justify-between items-center gap-4 mx-4">
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-1">
        <q-select
          class="rounded-lg w-[110px]"
          outlined
          v-model="status"
          :options="statusOptions"
          @update:model-value="
            switchTable
              ? getData(pagination.page)
              : getSpecialData(pagination.page)
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
    <div
      class="xl:w-[75%] w-full border-b-2 flex items-center justify-center gap-4"
    >
      <div
        class="cursor-pointer group relative transition-all"
        @click="switchTable = 'Ordinary'"
        :class="switchTable === 'Ordinary' ? 'text-primary font-semibold' : ''"
      >
        <span
          class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300"
          :class="switchTable === 'Ordinary' ? 'w-full' : 'w-0'"
          >&nbsp;</span
        >
        Ordinary
      </div>
      <div
        class="cursor-pointer group relative transition-all"
        @click="
          switchTable = 'Special';
          getSpecialData(pagination2.page);
        "
        :class="switchTable === 'Special' ? 'text-primary font-semibold' : ''"
      >
        <span
          class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300"
          :class="switchTable === 'Special' ? 'w-full' : 'w-0'"
          >&nbsp;</span
        >
        Special
      </div>
      <div
        class="cursor-pointer group relative transition-all"
        @click="
          switchTable = 'Adjust';
          getHistoryAdjustData(pagination3.page);
        "
        :class="switchTable === 'Adjust' ? 'text-primary font-semibold' : ''"
      >
        <span
          class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300"
          :class="switchTable === 'Adjust' ? 'w-full' : 'w-0'"
          >&nbsp;</span
        >
        Adjust History
      </div>
    </div>
  </div>
  <q-table
    v-if="
      (data && data.length >= 1) ||
      (specialData && specialData.length >= 1) ||
      (adjustData && adjustData.length >= 1)
    "
    class="my-table table-rounded mx-4"
    flat
    :columns="
      switchTable === 'Ordinary'
        ? column
        : switchTable === 'Special'
        ? column2
        : switchTable === 'Adjust'
        ? column3
        : []
    "
    :rows="
      switchTable === 'Ordinary'
        ? data
        : switchTable === 'Special'
        ? specialData
        : switchTable === 'Adjust'
        ? adjustData
        : []
    "
    v-model:pagination="pagination"
    hide-bottom
  >
    <template v-slot:body-cell-type="props">
      <q-td class="text-center" :props="props" v-if="props.row.typeOfLeave">
        <div class="w-fill rounded-3xl px-3 py-2">
          <p class="font-semibold">{{ props.row.typeOfLeave.name }}</p>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-start="props">
      <q-td class="text-center" :props="props" v-if="props.row.startLeave">
        <div class="w-fill rounded-3xl px-3 py-2">
          <p class="font-semibold">{{ formatDate(props.row.startLeave) }}</p>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-end="props">
      <q-td class="text-center" :props="props" v-if="props.row.endLeave">
        <div class="w-fill rounded-3xl px-3 py-2">
          <p class="font-semibold">{{ formatDate(props.row.endLeave) }}</p>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-status="props">
      <q-td class="text-center" :props="props" v-if="props.row.status">
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
    <template v-slot:body-cell-note="props">
      <q-td class="text-center" :props="props">
        <div v-if="props.row.note != null && props.row.status === 'REJECT'">
          <NoteBtn :note="props.row.note" :rejectBy="props.row.rejectBy" />
        </div>
        <div v-if="props.row.status === 'APPROVE' && props.row.approveBy">
          <NoteBtn :approveBy="props.row.approveBy" />
        </div>
        <div v-if="props.row.status === 'WAITING'">
          <p>Note not found</p>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-month="props">
      <q-td :props="props" class="text-center">
        <p>{{ formatMonth(props.row.month) }}</p>
      </q-td>
    </template>
  </q-table>
  <div v-else>
    <h1 class="text-center">No Data Available</h1>
  </div>
  <div
    class="row justify-center"
    v-if="pagination.rowsNumber > 1 && switchTable === 'Ordinary'"
  >
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
  <div
    class="row justify-center"
    v-if="pagination2.rowsNumber > 1 && switchTable === 'Special'"
  >
    <q-pagination
      v-model="current2"
      color="primary"
      :max="pagination2.rowsNumber"
      :max-pages="5"
      :ellipses="false"
      @update:model-value="getSpecialData(current2)"
      :boundary-numbers="false"
    />
  </div>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import { ref } from 'vue';
import api from 'src/AxiosInterceptors';
import { useRoute } from 'vue-router';
import NoteBtn from 'src/components/Display_Components/NoteBtn.vue';
import { Icon } from '@iconify/vue';
import { useQuasar } from 'quasar';
export default {
  components: {
    NoteBtn,
    Icon,
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
      {
        name: 'note',
        label: 'Note',
        align: 'center',
        field: 'note',
      },
    ];
    const column2 = [
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
        name: 'amount',
        label: 'Amount',
        align: 'center',
        field: 'amount',
      },
      {
        name: 'status',
        label: 'Status',
        align: 'center',
        field: 'statust',
      },
      {
        name: 'reason',
        label: 'Leave Title',
        align: 'center',
        field: 'leaveTitle',
      },
      {
        name: 'note',
        label: 'Note',
        align: 'center',
        field: 'note',
      },
    ];
    const column3 = [
      {
        name: 'negativeLeave',
        label: 'Negative Leave',
        align: 'center',
        field: 'negativeLeave',
      },
      {
        name: 'adjustBy',
        label: 'Adjust By',
        align: 'center',
        field: 'adjustBy',
      },
      {
        name: 'month',
        label: 'Month',
        align: 'center',
        field: 'month',
      },
    ];
    const route = useRoute();
    const $q = useQuasar();
    // TO GET ID FROM ROUTE
    const id = route.params.id;
    return {
      failedNotif(msg: any) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'negative',
          multiLine: true,
        });
      },
      column,
      column2,
      column3,
      id,
      current: ref(1),
      current2: ref(1),
      current3: ref(1),
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
      specialData: [],
      adjustData: [],
      // FOR PAGINATION
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
      pagination2: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
      pagination3: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
      switchTable: ref('Ordinary'),
      status: '',
      // FOR FILTER DATA
      statusOptions: ['Approve', 'Waiting', 'Reject'],

      typeLeave: '',
      typeLeaveOptions: ['Mandatory', 'Optional', 'Personal'],
    };
  },
  methods: {
    resetStatus() {
      this.status = '';
      this.current = 1;
      if (this.switchTable) {
        this.getData(this.pagination.page);
      } else {
        this.getSpecialData(this.pagination.page);
      }
    },
    resetType() {
      this.current = 1;
      this.typeLeave = '';
      this.getData(this.pagination.page);
    },
    toggleTable() {
      this.switchTable = false;
      this.status = '';
      this.current = 1;
      this.getSpecialData(this.pagination.page);
    },
    // TO GET DATA
    async getData(page: number | undefined) {
      await api
        .get(`/leave/history/${this.id}?page=${page}&perPage=8`, {
          params: {
            status: this.status,
            typeOfLeave: this.typeLeave,
          },
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
          if (err.response.status == 403) {
            this.failedNotif(err.response.data.message);
          }
        });
    },
    async getSpecialData(page: number | undefined) {
      await api
        .get(
          `/leave/employee-special-leave/history/${this.id}?page=${page}&perPage=8`,
          {
            params: {
              status: this.status,
            },
          }
        )
        .then((res) => {
          this.specialData = res.data.data;
          this.pagination2.rowsNumber = res.data.meta.lastPage;
        })
        .catch((err) => {
          console.error(err);
          if (err.response.status == 403) {
            this.failedNotif(err.response.data.message);
          }
        });
    },
    async getHistoryAdjustData(page: any) {
      await api
        .get(`/leave/adjust-leave/${this.id}?page=${page}&perPage=8`)
        .then((res) => {
          this.adjustData = res.data.data[0].leaveAdjustments;
          this.pagination.rowsNumber = res.data.meta.lastPage;
        })
        .catch((err) => {
          console.error(err);
          if (err.response.status == 403) {
            this.failedNotif(err.response.data.message);
          }
        });
    },
    // TO FORMAT DATE
    formatDate(dateString: string | number | Date) {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-UK', options);
      // return moment(dateString).format('ll');
    },
    formatMonth(monthNumber: number) {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      return months[monthNumber - 1];
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
