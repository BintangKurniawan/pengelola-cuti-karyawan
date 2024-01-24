<template>
  <q-table class="my-table table-rounded" flat :columns="column" :rows="data">
    <template v-slot:top-right>
      <AddPosition />
    </template>
    <template v-slot:body-cell-action="props">
      <q-td
        :props="props"
        class="flex items-center gap-1 justify-center md:w-full w-[200px]"
      >
        <EditPosition :id="props.row.id" />
        <DeletePositionBtn :id="props.row.id" />
      </q-td>
    </template>
  </q-table>
</template>

<script>
import api from 'src/AxiosInterceptors';
import { Icon } from '@iconify/vue';
import { useQuasar } from 'quasar';
import DeletePositionBtn from 'src/components/DeletePosition.vue';
import EditPosition from 'src/components/EditPosition.vue';
import AddPosition from 'src/components/AddPosition.vue';
export default {
  components: {
    DeletePositionBtn,
    EditPosition,
    AddPosition,
  },
  setup() {
    const $q = useQuasar();
    const column = [
      {
        name: 'id',
        label: 'ID',
        align: 'center',
        field: 'id',
      },
      {
        name: 'name',
        label: 'Name',
        align: 'center',
        field: 'name',
      },
      {
        name: 'employeeCount',
        label: 'Employee Count',
        align: 'center',
        field: 'employeeCount',
      },
      {
        name: 'action',
        label: 'Action',
        align: 'center',
        field: 'action',
      },
    ];
    return {
      column,
      successNotif(msg) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'primary',
          multiLine: true,
        });
      },
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
      data: [],
    };
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    // TO GET DATA
    async getData() {
      await api
        .get('/position', { withCredentials: true })
        .then((resp) => (this.data = resp.data.data))
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
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
