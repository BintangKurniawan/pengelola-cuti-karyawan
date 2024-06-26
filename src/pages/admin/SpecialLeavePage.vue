<template>
  <q-table
    class="my-table table-rounded mx-4"
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
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1">
            <q-select
              class="rounded-lg w-[120px]"
              outlined
              v-model="gender"
              :options="genderOptions"
              @update:model-value="getData(pagination.page)"
              label="Gender"
            >
            </q-select>
            <q-icon
              @click="resetGender"
              v-if="gender"
              size="16px"
              name="close"
              class="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:top-right>
      <div
        class="flex items-center md:justify-center md:gap-2 gap-1 md:mt-0 mt-4"
      >
        <AddSpecialLeave
          @get-data="handleChildEvent"
          v-if="permissions.includes('Create Special Leave')"
        />
      </div>
    </template>
    <template v-slot:body-cell-action="props">
      <q-td
        :props="props"
        class="flex gap-1 justify-center items-center text-center h-full"
      >
        <EditSpecialLeave
          :id="props.row.id"
          @get-data="handleChildEvent"
          v-if="permissions.includes('Update Special Leave')"
        />
        <DeleteSpecialLeave
          :id="props.row.id"
          @get-data="handleChildEvent"
          v-if="permissions.includes('Delete Special Leave List')"
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
import { ref } from 'vue';
import EditSpecialLeave from 'src/components/Edit_Components/EditSpecialLeave.vue';
import AddSpecialLeave from 'src/components/Add_Components/AddSpecialLeave.vue';
import DeleteSpecialLeave from 'src/components/Delete_Components/DeleteSpecialLeave.vue';
import { usePermissionStore } from 'src/stores/permissionStore';
export default {
  components: { EditSpecialLeave, AddSpecialLeave, DeleteSpecialLeave },
  setup() {
    const roleId = localStorage.getItem('role');
    const column = [
      {
        name: 'id',
        label: 'No',
        align: 'center',
        field: 'no',
        style: 'width: 80px;',
      },
      {
        name: 'leaveTitle',
        label: 'Leave Title',
        align: 'center',
        field: 'leaveTitle',

        style: 'width: 150px;',
      },
      {
        name: 'gender',
        label: 'Gender',
        align: 'center',
        field: 'gender',
        style: 'width: 150px;',
      },
      {
        name: 'amount',
        label: 'Amount',
        align: 'center',
        field: 'amount',
        style: 'width: 50px;',
      },
      {
        name: 'information',
        label: 'Leave Information',
        align: 'center',
        field: 'leaveInformation',
        style: 'width: 100px;',
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
      gender: '',
      // FOR FILTER DATA
      genderOptions: ['L', 'P', 'LP'],
    };
  },
  mounted() {
    // TO GET DATA
    this.getData(this.pagination.page);
  },
  methods: {
    handleChildEvent() {
      this.getData(this.current);
    },
    clearSearch() {
      this.search = '';
      this.getData(this.pagination.page);
    },
    // TO REMOVE FILTER
    resetGender() {
      this.gender = '';
      this.current = 1;
      this.getData(this.pagination.page);
    },

    async getData(page) {
      const perPage = window.innerWidth >= 768 ? 10 : 10;
      this.load = true;
      await api
        .get(`/leave/special-leaves?page=${page}&perPage=${perPage}`, {
          params: {
            search: this.search,
            gender: this.gender,
          },
        })
        .then((res) => {
          this.data = res.data.data;
          this.pagination.rowsNumber = res.data.meta.lastPage;
        })
        .catch((err) => {
          console.error(err);
          // setInterval(() => {
          //   document.location.reload();
          // }, 1000);
          if (err.response.status === 403) {
            this.$router.push('/forbidden');
          }
        });
      this.load = false;
    },
    // TO GETD ATA
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

@media (max-width: 1024px) {
  .w-custom {
    width: 100px;
  }
}
</style>
