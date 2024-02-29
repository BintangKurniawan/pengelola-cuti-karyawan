<template>
  <q-table
    class="my-table table-rounded mx-4"
    flat
    :columns="column"
    :rows="data"
    v-model:pagination="pagination"
    hide-pagination
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
      <AddRole
        @get-data="handleChildEvent"
        v-if="permissions.includes('Create Role')"
      />
    </template>

    <template v-slot:body-cell-action="props">
      <q-td
        :props="props"
        class="flex items-center gap-1 justify-center md:w-full w-[200px]"
      >
        <PermissionDetail
          :id="props.row.id"
          :count="props.row.rolePermissionCount"
        />
        <EditRole
          :id="props.row.id"
          @get-data="handleChildEvent"
          v-if="permissions.includes('Update Role')"
        />
        <DeleteRole
          :id="props.row.id"
          @get-data="handleChildEvent"
          v-if="permissions.includes('Delete Role')"
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
import PermissionDetail from 'src/components/Display_Components/PermissionDetail.vue';
import DeleteRole from 'src/components/Delete_Components/DeleteRole.vue';
import AddRole from 'src/components/Add_Components/AddRole.vue';
import EditRole from 'src/components/Edit_Components/EditRole.vue';
export default {
  components: {
    PermissionDetail,
    DeleteRole,
    AddRole,
    EditRole,
  },
  setup() {
    const $q = useQuasar();
    const column = [
      {
        name: 'id',
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
        name: 'permissionCount',
        label: 'Permission Count',
        align: 'center',
        field: 'rolePermissionCount',
      },
      {
        name: 'userCount',
        label: 'User Count',
        align: 'center',
        field: 'userCount',
      },
      {
        name: 'action',
        label: 'Action',
        align: 'center',
        field: 'action',
      },
    ];

    const permissions = JSON.parse(localStorage.getItem('permissions'));
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
    };
  },
  async mounted() {
    await this.getData(this.pagination.page);
  },
  methods: {
    handleChildEvent() {
      this.getData(this.current);
    },
    // TO GET DATA
    async getData(page) {
      const perPage = window.innerWidth >= 768 ? 10 : 9;
      await api
        .get(`/role?page=${page}&perPage=${perPage}`, {
          params: {
            search: this.search,
          },
          withCredentials: true,
        })
        .then((resp) => {
          this.data = resp.data.data;
          this.pagination.rowsNumber = resp.data.meta.lastPage;

          // TO SAVE POSITION DATA IN LOCALSTORAGE. WHY I DO THIS? COZ IN SETTING I NEED THE POSIITON DATA
          const positionDataString = JSON.stringify(this.data);
          localStorage.setItem('position', positionDataString);
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
