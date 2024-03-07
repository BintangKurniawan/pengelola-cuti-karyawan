<template>
  <div class="flex flex-col items-center justify-center">
    <q-btn
      dense
      flat
      @click="$router.back()"
      class="flex items-start w-fit hover:bg-gray-100 p-4 text-black self-start capitalize"
    >
      <div class="flex items-center gap-4">
        <Icon icon="mdi:arrow-left-circle-outline" width="24" />
        <p class="capitalize">Back</p>
      </div>
    </q-btn>
    <div class="flex flex-wrap items-center gap-4 xl:w-[1128px] justify-center">
      <div class="flex flex-col gap-4 md:w-fit w-full custom-size">
        <h5 class="font-semibold text-2xl">NIK</h5>
        <q-input
          outlined
          color="dark"
          bg-color="grey-2"
          for="nik"
          disable
          v-model="nik"
          placeholder="NIK"
          class="drop-shadow-sm md:w-[270px] w-full outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4 md:w-fit w-full custom-size">
        <h5 class="font-semibold text-2xl">Name</h5>
        <q-input
          outlined
          color="dark"
          :bg-color="
            permissions.includes('Update Employee') ? 'white' : 'grey-2'
          "
          :disable="!permissions.includes('Update Employee')"
          for="name"
          v-model="name"
          placeholder="Name"
          class="drop-shadow-sm md:w-[270px] w-full outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div
        class="flex flex-col gap-4 md:w-fit w-full custom-size"
        v-if="statusBoolean"
      >
        <h5 class="font-semibold text-2xl">Position</h5>
        <q-select
          outlined
          class="md:w-[270px] w-full"
          label-color="Primary"
          :bg-color="
            permissions.includes('Update Employee') ? 'white' : 'grey-2'
          "
          :disable="!permissions.includes('Update Employee')"
          v-model="typePosition"
          :options="typePositionOptions"
          emit-value
          map-options
          label="Position"
        ></q-select>
      </div>

      <div class="flex flex-col gap-4 md:w-fit w-full custom-size">
        <h5 class="font-semibold text-2xl">Status</h5>
        <div
          class="md:w-[270px] w-full px-3 py-4 rounded-[4px]"
          :class="{
            'bg-[#EBF9F1] text-[#1F9254] ': status === 'Active',
            'bg-[#FBE7E8] text-[#A30D11] ': status === 'Resign',
          }"
        >
          {{ status }}
        </div>
      </div>

      <div class="flex flex-col gap-4 md:w-fit w-full custom-size">
        <h5 class="font-semibold text-2xl">Gender</h5>
        <q-select
          outlined
          class="md:w-[270px] w-full"
          label-color="Primary"
          :bg-color="
            permissions.includes('Update Employee') ? 'white' : 'grey-2'
          "
          :disable="!permissions.includes('Update Employee')"
          v-model="gender"
          :options="genderOptions"
          label="Position"
        ></q-select>
      </div>

      <div class="flex flex-col gap-4 md:w-fit w-full custom-size">
        <h5 class="font-semibold text-2xl">Start Contract</h5>
        <q-input
          outlined
          color="dark"
          :bg-color="contractBoolean === false ? 'grey-2' : 'white'"
          for="startWork"
          v-model="start"
          :disable="
            contractBoolean === false ||
            !permissions.includes('Update Employee')
          "
          placeholder="Start Working"
          class="drop-shadow-sm md:w-[270px] w-full outline-none focus:bg-transparent active:bg-transparent"
        >
          <template v-slot:append>
            <q-icon name="event" color="dark" class="cursor-pointer">
              <q-popup-proxy>
                <q-date
                  v-model="start"
                  :mask="mask"
                  default-view="Years"
                  color="primary"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div
        class="flex flex-col gap-4 md:w-fit w-full custom-size"
        v-if="contractBoolean"
      >
        <h5 class="font-semibold text-2xl">Contract Expires</h5>
        <q-input
          outlined
          for="date"
          color="dark"
          :bg-color="
            permissions.includes('Update Employee') ? 'white' : 'grey-2'
          "
          :disable="!permissions.includes('Update Employee')"
          class="md:w-[270px] w-full"
          v-model="exp"
        >
          <template v-slot:append>
            <q-icon name="event" color="dark" class="cursor-pointer">
              <q-popup-proxy>
                <q-date
                  v-model="exp"
                  :mask="mask"
                  default-view="Years"
                  color="primary"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div
        class="flex flex-col gap-4 md:w-fit w-full custom-size"
        v-if="contractBoolean"
      >
        <h5 class="font-semibold text-2xl">Employee Status</h5>
        <q-select
          outlined
          class="md:w-[270px] w-full"
          :bg-color="
            permissions.includes('Update Employee') ? 'white' : 'grey-2'
          "
          :disable="!permissions.includes('Update Employee')"
          v-model="contractType"
          :options="contractTypeOptions"
          @update:model-value="contractTypeUpdate"
          label="Employee Status"
        />
      </div>

      <div class="flex flex-col gap-4 md:w-fit w-full custom-size">
        <h5 class="font-semibold text-2xl">Type of Employee</h5>
        <q-select
          outlined
          class="md:w-[270px] w-full"
          :bg-color="
            permissions.includes('Update Employee') ? 'white' : 'grey-2'
          "
          :disable="!permissions.includes('Update Employee')"
          v-model="typeContract"
          :options="typeContractOptions"
          @update:model-value="updateContractId"
          label="Type Employee"
        ></q-select>
      </div>

      <div class="flex flex-col gap-4 md:w-fit w-full custom-size">
        <h5 class="font-semibold text-2xl">Email</h5>
        <q-input
          outlined
          color="dark"
          bg-color="grey-2"
          for="email"
          readonly
          v-model="email"
          placeholder="Email"
          class="drop-shadow-sm md:w-[270px] w-full outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div
        class="flex flex-col gap-4 md:w-fit w-full custom-size"
        v-if="roleId === '1'"
      >
        <h5 class="font-semibold text-2xl">Role</h5>
        <q-select
          outlined
          class="md:w-[270px] w-full"
          v-model="roleType"
          :options="roleTypeOptions"
          label="Role"
          emit-value
          map-options
        />
      </div>
      <div
        class="flex flex-col gap-4 md:w-fit w-full custom-size h-[104px] justify-end"
      >
        <q-btn
          color="primary"
          @click="edit"
          text-color="white"
          label="Save Changes"
          class="md:w-[270px] h-[56px] capitalize rounded-3xl"
        />
      </div>
      <div
        class="flex flex-col h-[104px] justify-end"
        v-if="permissions.includes('Reset Password')"
      >
        <Reset :id="id" />
      </div>
    </div>
  </div>
  <q-spinner
    size="5em"
    v-if="loading"
    color="primary"
    class="absolute top-[50%] left-[50%]"
  />
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script lang="ts">
import Reset from 'src/components/ResetBtn.vue';
import { useRoute } from 'vue-router';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
import { onBeforeUnmount, ref } from 'vue';
import { Icon } from '@iconify/vue';
// import moment from 'moment';
import 'moment/locale/en-ca';

export default {
  setup() {
    const route = useRoute();
    // TO GET ID FROM ROUTE
    const id = route.params.id;
    const $q = useQuasar();

    // TO GET ROLE
    const roleId = localStorage.getItem('role');

    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    return {
      permissions,
      roleId,
      id,
      showLoading() {
        $q.loading.show();
      },
      date: ref('2023-11-20'),
      saveNotif(msg: any) {
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
      loading: false,
      name: '',
      nik: '',
      position: '',
      email: '',
      start: '',
      expires: '',

      // FOR END CONTRACT
      exp: '',
      status: '',
      mask: 'YYYY-MM-DD',

      // TO GET STATUS WORK, IS ACTIVE OR RESIGN, CAUSE IF EMPLOYEE IS RESIGN, THE POSITION CAN'T BE EDITED
      statusBoolean: false,
      historicalName: '',
      historicalNik: '',

      // TO RECEIVED TYPE CONTRACT FROM Q-SELECT
      typeContract: {} as { status: boolean; label: string },
      // TYPE CONTRACT OPTIONS FOR Q-SELECT
      typeContractOptions: [
        { status: false, label: 'Permanent' },
        { status: true, label: 'Contract' },
      ],
      // TO GET STATUS IS FALSE OR TRUE FROM SELECTED TYPE CONTRACT
      contractBoolean: false,

      // TO RECEIVED POSITION FROM Q-SELECT
      typePosition: null,
      // FOR POSITION DATA FROM API
      typePositionOptions: [],
      // TO GET POSITION ID FROM SELECTED POSITION
      positionId: '',

      // TO RECEIVED CONTRACT TYPE, IS OLD OR NEW FROM Q-SELECT
      contractType: null,
      // CONTRACT TYPE FOR Q-SELECT
      contractTypeOptions: [
        { value: false, label: 'Old Employee' },
        { value: true, label: 'New Employee' },
      ],
      // TO GET CONTRACT IS FALSE OR TRUE FROM SELECTED contractType
      contract: null,

      // TO RECEIVED ROLE FROM Q-SELECT
      roleType: null,
      // ROLE OPTIONS FOR Q-SELECT
      roleTypeOptions: [],
      // TO GET ROLE FROM SELECTED roleType
      role: 3,

      gender: null,
      genderOptions: ['L', 'P'],
    };
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { Reset, Icon },
  async mounted() {
    // TO GET POSITION AND EMPLOYEE DATA
    await this.getPosition();
    await this.getRole();
    await this.getData();
  },
  methods: {
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

          this.typePositionOptions = mappedPositions;
          console.log(this.typePositionOptions);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async getRole() {
      await api
        .get('/role/select')
        .then((res) => {
          const roles = res.data.data;
          const mappedRoles = roles.map((roles: { id: any; name: any }) => {
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
    async getData() {
      try {
        await api.get(`/employee/detail/${this.id}`).then((resp) => {
          this.nik = resp.data.data[0].nik;
          this.name = resp.data.data[0].name;
          // this.position = resp.data.data[0].positions.name;
          this.email = resp.data.data[0].user.email;
          this.start = this.formatDate(
            resp.data.data[0].typeOfEmployee.startContract
          );
          this.contractType = this.getContractTypeText(
            resp.data.data[0].typeOfEmployee.newContract
          );
          this.gender = resp.data.data[0].gender;
          this.contract = resp.data.data[0].typeOfEmployee.newContract;
          this.expires = resp.data.data[0].typeOfEmployee.endContract;
          this.status = this.getStatusText(resp.data.data[0].isWorking);
          this.statusBoolean = resp.data.data[0].isWorking;
          this.typeContract = this.getContractText(
            resp.data.data[0].typeOfEmployee.isContract
          );

          this.contractBoolean = resp.data.data[0].typeOfEmployee.isContract;
          // this.role = this.getRoleId(resp.data.data[0].user.role.name);
          // this.roleType = this.getRoleText(resp.data.data[0].user.role.name);
          this.roleType = resp.data.data[0].user.role.id;
          console.log(this.role);

          if (resp.data.data[0].typeOfEmployee.endContract) {
            this.exp = this.formatDate(
              resp.data.data[0].typeOfEmployee.endContract
            );
          }
          this.typePosition = resp.data.data[0].positions.id;
        });
      } catch (err) {
        console.error(err);
      }
    },

    // TO UPDATE THE RECEIVED CONTRACT TYPE IS NEW OR OLD, THE this.contract WILL BE USED TO UPDATE DATA
    contractTypeUpdate() {
      this.contract = this.contractType.value;
      console.log(this.contract);
    },
    // TO GET STATUS TEXT IS ACTIVE OR RESIGN
    getStatusText(status: any) {
      return status ? 'Active' : 'Resign';
    },

    // TO GET POSITION TEXT GAINED FROM API getData AND COMPARE IT WITH POSITIONS DATA, IF TRUE RETURN THE POSITION NAME
    getPositionText(name: any) {
      const typePosition = this.typePositionOptions.find(
        (option) => option.label === name
      );

      return typePosition ? typePosition.label : null;
    },
    getContractTypeText(name: any) {
      const contractOption = this.contractTypeOptions.find(
        (option) => option.value === name
      );
      return contractOption ? contractOption.label : null;
    },
    // TO GET TYPE CONTRACT TEXT, IS PERMANENT OR NOT
    getContractText(status: any) {
      const statusOption = this.typeContractOptions.find(
        (option) => option.status === status
      );
      return statusOption ? statusOption.label : null;
      // return status ? 'Active' : 'Resign';
    },

    // TO GET ROLE TEXT
    // getRoleText(role: any) {
    //   const roleType = this.roleTypeOptions.find(
    //     (option) => option.label === role
    //   );

    //   return roleType ? roleType.label : null;
    // },

    // TO UPDATE TYPE CONTRACT, IS PERMANENT OR NOT. AND IF PERMANENT, THE END CONTRACT IS NULL
    updateContractId() {
      this.contractBoolean = this.typeContract.status;
      if (this.contractBoolean === false) {
        this.exp = '';
      }
      console.log(this.contractBoolean);
    },
    // TO SET POSITION ID FROM SELECTED POSITION IN Q-SELECT
    // updatePositionId() {
    //   this.positionId = this.typePosition.value;
    //   console.log(this.positionId);
    // },
    // TO SET ROLE ID FROM SELECTED ROLE IN Q-SELECT
    // updateRole() {
    //   this.role = this.roleType.value;
    //   console.log(this.role);
    // },

    // TO FORMAT DATE
    formatDate(dateString: {
      split: (arg0: string) => {
        (): any;
        new (): any;
        map: { (arg0: NumberConstructor): [any, any, any]; new (): any };
      };
    }) {
      const [day, month, year] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-UK', options);
    },

    // TO GET POSITION NAME
    // getId(name: any) {
    //   const typePosition = this.typePositionOptions.find(
    //     (option) => option.label === name
    //   );
    //   return typePosition ? typePosition.value : null;
    // },
    // TO GET ROLE NAME
    // getRoleId(role: any) {
    //   const roleTypeOptions = this.roleTypeOptions.find(
    //     (option) => option.label === role
    //   );

    //   return roleTypeOptions ? roleTypeOptions.value : null;
    // },
    // TO EDIT
    async edit() {
      this.showLoading();
      await api
        .put(
          `/employee/update/${this.id}`,
          {
            name: this.name,
            positionId: this.typePosition,
            gender: this.gender,
            typeOfEmployee: {
              isContract: this.contractBoolean,
              endContract: this.exp,
              newContract: this.contract,
            },
          },
          {
            headers: {
              Accept: '*/*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then((resp) => {
          console.log(resp);
          this.saveNotif(resp.data.message);
          setInterval(() => {
            document.location.reload();
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
            this.$q.loading.hide();
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .custom-size {
    margin: 0 16px 0 16px;
  }
}
</style>
