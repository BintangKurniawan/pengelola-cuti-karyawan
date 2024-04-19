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
            @update:model-value="getData()"
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
    <template v-slot:body-cell-action="props">
      <q-td :props="props" class="items-center gap-1 justify-center w-[200px]">
        <SendEmailBtn
          :id="props.row.id"
          :type="props.row.name"
          v-if="
            props.row.emailSent === false &&
            permissions.includes('Send Email for Leave')
          "
          @get-data="getData()"
        />
        <p v-else>Email has been sent</p>
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
import SendEmailBtn from 'src/components/Set_Components/SendEmailBtn.vue';
import { usePermissionStore } from 'src/stores/permissionStore';
export default {
  setup() {
    const $q = useQuasar();
    const column = [
      {
        name: 'name',
        label: 'Leave Title',
        align: 'center',
        field: 'name',
      },
      {
        name: 'start',
        label: 'Start Leave',
        align: 'center',
        field: 'startLeave',
      },
      {
        name: 'end',
        label: 'End Leave',
        align: 'center',
        field: 'endLeave',
      },
      {
        name: 'leaveUsed',
        label: 'Leave Used',
        align: 'center',
        field: 'leaveUse',
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

    const perm = usePermissionStore();
    const permissions = perm.getPerm;
    return {
      permissions,
      column,
      current: ref(1),
    };
  },
  data() {
    return {
      load: false,
      data: [],
      pagination: {
        rowsPerPage: 10,
        page: 1,
        rowsNumber: 0,
      },
      search: '',
      typeLeave: '',
      typeLeaveOptions: ['Mandatory', 'Optional'],
    };
  },
  mounted() {
    this.getData(this.pagination.page);
  },
  methods: {
    resetType() {
      this.current = 1;
      this.typeLeave = '';
      this.getData(this.pagination.page);
    },
    async getData(page) {
      const perPage = window.innerWidth >= 768 ? 10 : 10;
      this.load = true;
      await api
        .get(`/leave/collective-leave?page=${page}&perPage=${perPage}`, {
          params: {
            search: this.search,
            typeOfLeave: this.typeLeave,
          },
        })
        .then((res) => {
          this.data = res.data.data;
          this.pagination.rowsNumber = res.data.meta.lastPage;
          this.load = false;
        })
        .catch((err) => {
          this.load = false;
          if (err.response.status === 403) {
            this.$router.push('/forbidden');
          }
        });
    },
    formatDate(dateString) {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-UK', options);
    },
  },
  components: { SendEmailBtn },
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
