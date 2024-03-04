<template>
  <div class="flex flex-col justify-center items-center">
    <q-btn
      dense
      flat
      @click="back()"
      class="flex items-start w-full md:w-fit hover:bg-gray-100 p-4 text-black self-start"
    >
      <div class="flex items-center gap-4">
        <Icon icon="mdi:arrow-left-circle-outline" width="24" />
        <p class="capitalize">Back</p>
      </div>
    </q-btn>
    <div class="flex flex-wrap items-center gap-4 w-[1128px]">
      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">NIK</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="nik"
          readonly
          v-model="nik"
          placeholder="NIK"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Name</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="name"
          v-model="name"
          readonly
          placeholder="Name"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Position</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="position"
          readonly
          v-model="position"
          placeholder="Position"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Status</h5>
        <div
          class="md:w-[270px] w-[100px] custom-text-size px-3 py-4 rounded-[4px] md:text-start text-center"
          :class="{
            'bg-[#EBF9F1] text-[#1F9254] ': status === 'Active',
            'bg-[#FBE7E8] text-[#A30D11] ': status === 'Resign',
          }"
        >
          {{ status }}
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Gender</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="gender"
          readonly
          v-model="gender"
          placeholder="Gender"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Start Working</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="startWork"
          v-model="start"
          readonly
          placeholder="Start Working"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4" v-if="expDate">
        <h5 class="font-semibold text-xs md:text-2xl">Contract Expires</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="expires"
          v-model="expires"
          readonly
          placeholder="Contract Expires"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Employee Status</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="employeestatus"
          readonly
          v-model="employeeStstus"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Type of Employee</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="type"
          readonly
          v-model="type"
          placeholder="Type of Employee"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Role</h5>
        <!-- <q-input
          outlined
          color="dark"
          bg-color="white"
          for="role"
          readonly
          v-model="role"
          placeholder="Role"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        /> -->

        <q-select
          :disable="!permissions.includes('Update Role')"
          outlined
          class="md:w-[270px] w-full"
          v-model="roleType"
          :options="roleTypeOptions"
          @update:model-value="saveRole(roleType)"
          label="Role"
          emit-value
          map-options
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Email</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="email"
          readonly
          v-model="email"
          placeholder="Email"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Added by</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="admin"
          readonly
          v-model="historicalName"
          placeholder="Admin"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-xs md:text-2xl">Adder's NIK</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="adminNik"
          readonly
          v-model="historicalNik"
          placeholder="NIK"
          class="drop-shadow-sm md:w-[270px] w-[100px] custom-text-size outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4 justify-end">
        <h5 class="font-semibold text-xs md:text-2xl opacity-0 cursor-default">
          Adder's NIK
        </h5>
        <q-btn
          color="primary"
          text-color="white"
          label="Edit Profile"
          class="md:w-[270px] h-[56px] rounded-3xl"
          @click="$router.push(`/admin/detail/${id}/edit`)"
        />
      </div>

      <div
        class="flex flex-col h-[104px] justify-end"
        v-if="permissions.includes('Enable Employee')"
      >
        <ActivateBtn :id="id" v-if="status === 'Resign'" />
      </div>
    </div>
  </div>
</template>

<script>
import api from 'src/AxiosInterceptors';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import moment from 'moment';
import ActivateBtn from 'src/components/Positive_Components/ActivateBtn.vue';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const maxLengthMobile = 12;
    const roleId = localStorage.getItem('role');
    const route = useRoute();
    const permissions = JSON.parse(localStorage.getItem('permissions'));
    const $q = useQuasar();
    //  TO GET ID FROM ROUTE
    const id = route.params.id;
    return {
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
      permissions,
      roleId,
      maxLengthMobile,
      id,
    };
  },
  mounted() {
    // TO GET DATA
    this.getData();
    this.getRole();
  },
  data() {
    return {
      name: '',
      nik: '',
      gender: '',
      position: '',
      email: '',
      start: '',
      expires: '',
      status: '',
      historicalName: '',
      historicalNik: '',
      type: '',
      role: '',
      employeeStstus: '',
      // FOR NEW CONTRACT, IS NEW OR FALSE
      expDate: false,
      roleType: null,
      roleTypeOptions: [],
    };
  },
  methods: {
    limitStringMobile(str) {
      if (str.length <= this.maxLengthMobile) {
        return str;
      } else {
        return str.substring(0, this.maxLengthMobile) + '...';
      }
    },
    back() {
      this.$router.back();
    },
    async getRole() {
      await api
        .get('/role/select')
        .then((res) => {
          const roles = res.data.data;
          const mappedRoles = roles.map((roles) => {
            return {
              value: roles.id,
              label: roles.name,
            };
          });

          this.roleTypeOptions = mappedRoles;
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
    async saveRole(roleType) {
      await api
        .patch(`/employee/update-role/${this.nik}`, {
          roleId: roleType,
        })
        .then((res) => {
          this.successNotif(res.data.message);
          this.getData();
        })
        .catch((err) => {
          if (err.response.data.message) {
            this.fail;
          }
        });
    },
    // TO GET DATA
    async getData() {
      await api
        .get(`/employee/detail/${this.id}`)
        .then((resp) => {
          this.nik = resp.data.data[0].nik;
          this.name = resp.data.data[0].name;
          this.position = resp.data.data[0].positions.name;
          this.gender = resp.data.data[0].gender;
          this.email = resp.data.data[0].user.email;
          this.start = this.formatDate(
            resp.data.data[0].typeOfEmployee.startContract
          );
          this.role = resp.data.data[0].user.role.name;
          if (
            resp.data.data[0].typeOfEmployee &&
            resp.data.data[0].typeOfEmployee.endContract
          ) {
            this.expires = this.formatDate(
              resp.data.data[0].typeOfEmployee.endContract
            );
          }
          this.employeeStstus = this.getStatusEmployeeText(
            resp.data.data[0].typeOfEmployee.newContract
          );
          this.status = this.getStatusText(resp.data.data[0].isWorking);
          this.type = this.getContractText(
            resp.data.data[0].typeOfEmployee.isContract
          );
          this.roleType = resp.data.data[0].user.role.id;
          this.expDate = resp.data.data[0].typeOfEmployee.isContract;
          this.historicalName = resp.data.data[0].historicalName;
          this.historicalNik = resp.data.data[0].historicalNik;
          console.log(this.status);
          console.log(resp.data.data);
          console.log(this.historicalName);
        })
        .catch((err) => {
          if (err.response) {
            setInterval(() => {
              document.location.reload();
            }, 1000);
          }
        });
    },
    // TO FORMAT THE DATE GAINED FROM API
    formatDate(dateString) {
      const [day, month, year] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-UK', options);
    },
    // TO GET STATUS TEXT IS ACTIVE OR RESIGN
    getStatusText(status) {
      return status ? 'Active' : 'Resign';
    },
    // TO GET STATUS CONTRACT TEXT
    getContractText(status) {
      return status ? 'Contract' : 'Permanent';
    },
    // TO GET STATUS EMPLOYEE TEXT
    getStatusEmployeeText(status) {
      return status ? 'New Employee' : 'Old Employee';
    },
  },
  components: { ActivateBtn, Icon },
};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .custom-text-size {
    font-size: 10px;
    text-wrap: wrap;
  }
}
</style>
