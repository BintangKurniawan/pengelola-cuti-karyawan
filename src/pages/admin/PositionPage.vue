<template>
  <q-table
    class="my-table table-rounded mx-4"
    flat
    :columns="column"
    :rows="data"
    :loading="load"
    v-model:pagination="pagination"
    hide-pagination
    row-key
  >
    <template v-slot:top-left>
      <div class="flex items-center gap-2">
        <div class="px-2 rounded-lg border-2 border-secondary">
          <q-input
            borderless
            dense
            class="w-[160px]"
            v-model="search"
            clearable
            debounce="300"
            clear-icon="close"
            input-class="placeholder-color text-black"
            @update:model-value="getData(pagination.page)"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" class="text-black" />
            </template>
          </q-input>
        </div>
      </div>
    </template>
    <template v-slot:top-right>
      <AddPosition
        @get-data="handleChildEvent"
        v-if="permissions.includes('Add Positions')"
      />
    </template>
    <template v-slot:body-cell-id="props">
      <q-td :props="props" class="">
        <!-- <p v-for="(e, i) in props.row" v-bind:key="i">
          {{ i }}
        </p> -->
        <p>
          {{ props.row.id }}
        </p>
      </q-td>
    </template>
    <template v-slot:body-cell-employeeCount="props">
      <q-td :props="props" class="">
        <p
          @click="goToPosition(props.row.name)"
          class="cursor-pointer hover:underline"
        >
          {{ props.row.employeeCount }}
        </p>
      </q-td>
    </template>
    <template v-slot:body-cell-action="props">
      <q-td
        :props="props"
        class="flex items-center gap-1 justify-center md:w-full w-[200px]"
      >
        <EditPosition
          :id="props.row.id"
          @get-data="handleChildEvent"
          v-if="permissions.includes('Update Positions')"
        />
        <DeletePositionBtn
          :id="props.row.id"
          @get-data="handleChildEvent"
          v-if="permissions.includes('Delete Positions')"
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
      @update:model-value="getData(current)"
      :boundary-numbers="false"
      direction-links
      boundary-links
    />
  </div>
</template>

<script>
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import DeletePositionBtn from 'src/components/Delete_Components/DeletePosition.vue';
import EditPosition from 'src/components/Edit_Components/EditPosition.vue';
import AddPosition from 'src/components/Add_Components/AddPosition.vue';
import { usePermissionStore } from 'src/stores/permissionStore';
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
        name: 'no',
        label: 'No',
        align: 'center',
        field: 'no',
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
    const perm = usePermissionStore();
    const permissions = perm.getPerm;
    return {
      permissions,
      column,
      current: ref(1),
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
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
      search: '',
      load: false,
    };
  },
  async mounted() {
    await this.getData(this.pagination.page);
  },
  methods: {
    handleChildEvent() {
      this.getData(this.current);
    },
    goToPosition(position) {
      this.$router.push(`/admin/dashboard?position=${position}`);
    },
    // TO GET DATA
    async getData(page) {
      const perPage = window.innerWidth >= 768 ? 10 : 9;
      this.load = true;
      await api
        .get(`/position?page=${page}&perPage=${perPage}`, {
          params: {
            search: this.search,
          },
        })
        .then((resp) => {
          this.data = resp.data.data;
          this.pagination.rowsNumber = resp.data.meta.lastPage;

          // TO SAVE POSITION DATA IN LOCALSTORAGE. WHY I DO THIS? COZ IN SETTING I NEED THE POSIITON DATA
          const positionDataString = JSON.stringify(this.data);
          localStorage.setItem('position', positionDataString);
          this.load = false;
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
