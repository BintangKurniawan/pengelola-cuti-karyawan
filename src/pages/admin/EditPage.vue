<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-wrap items-center gap-4 w-[1128px]">
      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">NIK</h5>
        <q-input
          outlined
          color="dark"
          bg-color="grey-2"
          for="nik"
          :disable="roleId === '1'"
          v-model="nik"
          placeholder="NIK"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Name</h5>
        <q-input
          outlined
          color="dark"
          :bg-color="roleId === '1' ? 'grey-2' : 'white'"
          :disable="roleId === '1'"
          for="name"
          v-model="name"
          placeholder="Name"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4" v-if="statusBoolean">
        <h5 class="font-semibold text-2xl">Position</h5>
        <q-select
          outlined
          class="w-[270px]"
          label-color="Primary"
          :bg-color="roleId === '1' ? 'grey-2' : 'white'"
          :disable="roleId === '1'"
          v-model="typePosition"
          :options="typePositionOptions"
          @update:model-value="updatePositionId"
          label="Type Employee"
        ></q-select>
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Status</h5>
        <div
          class="w-[270px] px-3 py-4 rounded-[4px]"
          :class="{
            'bg-[#EBF9F1] text-[#1F9254] ': status === 'Active',
            'bg-[#FBE7E8] text-[#A30D11] ': status === 'Resign',
          }"
        >
          {{ status }}
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Start Working</h5>
        <q-input
          outlined
          color="dark"
          bg-color="grey-2"
          for="startWork"
          v-model="start"
          disable
          placeholder="Start Working"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4" v-if="contractBoolean">
        <h5 class="font-semibold text-2xl">Contract Expires</h5>
        <q-input
          outlined
          for="date"
          color="dark"
          :bg-color="roleId === '1' ? 'grey-2' : 'white'"
          :disable="roleId === '1'"
          class="w-[270px]"
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

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Type of Employee</h5>
        <q-select
          outlined
          class="w-[270px]"
          :bg-color="roleId === '1' ? 'grey-2' : 'white'"
          :disable="roleId === '1'"
          v-model="typeContract"
          :options="typeContractOptions"
          @update:model-value="updateContractId"
          label="Type Employee"
        ></q-select>
      </div>

      <div class="flex flex-col gap-4" v-if="contractBoolean">
        <h5 class="font-semibold text-2xl">Type of Contract</h5>
        <q-select
          outlined
          class="w-[270px]"
          :bg-color="roleId === '1' ? 'grey-2' : 'white'"
          :disable="roleId === '1'"
          v-model="contractType"
          :options="contractTypeOptions"
          @update:model-value="contractTypeUpdate"
          label="Type Contract"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Email</h5>
        <q-input
          outlined
          color="dark"
          bg-color="grey-2"
          for="email"
          readonly
          v-model="email"
          placeholder="Email"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4" v-if="roleId === '1'">
        <h5 class="font-semibold text-2xl">Role</h5>
        <q-select
          outlined
          class="w-[270px]"
          v-model="roleType"
          :options="roleTypeOptions"
          @update:model-value="updateRole"
          label="Role"
        />
      </div>
      <div class="flex flex-col gap-4 h-[104px] justify-end">
        <q-btn
          color="primary"
          @click="edit"
          text-color="white"
          label="Save Changes"
          class="w-[270px] h-[56px] capitalize rounded-3xl"
        />
      </div>
      <div class="flex flex-col h-[104px] justify-end">
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

<script lang="ts">
import Reset from 'src/components/ResetBtn.vue';
import { useRoute } from 'vue-router';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
import { onBeforeUnmount, ref } from 'vue';
import { Icon } from '@iconify/vue';
import moment from 'moment';
import 'moment/locale/en-ca';

export default {
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const $q = useQuasar();
    let timer: string | number | NodeJS.Timeout | undefined;
    const roleId = localStorage.getItem('role');
    onBeforeUnmount(() => {
      if (timer !== void 0) {
        clearTimeout(timer);
        $q.loading.hide();
      }
    });
    return {
      roleId,
      id,
      showLoading() {
        $q.loading.show();

        timer = setTimeout(() => {
          $q.loading.hide();
          timer = void 0;
        }, 500);
      },
      date: ref('2023-11-20'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      saveNotif(msg: any) {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: `${msg}`,
          color: 'primary',
          multiLine: true,
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      exp: '',
      status: '',
      mask: 'YYYY-MM-DD',
      statusBoolean: false,
      historicalName: '',
      historicalNik: '',

      typeContract: {} as { status: boolean; label: string },
      typeContractOptions: [
        { status: false, label: 'Permanent' },
        { status: true, label: 'Contract' },
      ],
      contractBoolean: false,

      typePosition: {} as { value: number; label: string },
      typePositionOptions: [],
      positionId: '',

      contractType: null,
      contractTypeOptions: [
        { value: false, label: 'Old Employee' },
        { value: true, label: 'New Employee' },
      ],
      contract: false,

      roleType: null,
      roleTypeOptions: [
        { value: 2, label: 'Admin' },
        { value: 3, label: 'User' },
      ],
      role: 3,
    };
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { Reset, Icon },
  async mounted() {
    await this.getPosition();
    await this.getData();
  },
  methods: {
    async getPosition() {
      await api
        .get('/position', { withCredentials: true })
        .then((resp) => {
          const positions = resp.data.data;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mappedPositions = positions.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    async getData() {
      try {
        await api
          .get(`/employee/detail/${this.id}`, {
            withCredentials: true,
          })
          .then((resp) => {
            this.nik = resp.data.data[0].nik;
            this.name = resp.data.data[0].name;
            // this.position = resp.data.data[0].positions.name;
            this.email = resp.data.data[0].user.email;
            this.start = this.formatDate(
              resp.data.data[0].typeOfEmployee.startContract
            );
            this.expires = resp.data.data[0].typeOfEmployee.endContract;
            this.status = this.getStatusText(resp.data.data[0].isWorking);
            this.statusBoolean = resp.data.data[0].isWorking;
            this.typeContract = this.getContractText(
              resp.data.data[0].typeOfEmployee.isContract
            );

            this.contractBoolean = resp.data.data[0].typeOfEmployee.isContract;
            this.role = this.getRoleId(resp.data.data[0].user.role.name);
            this.roleType = this.getRoleText(resp.data.data[0].user.role.name);
            console.log(this.role);

            if (resp.data.data[0].typeOfEmployee.endContract) {
              this.exp = this.formatDate(
                resp.data.data[0].typeOfEmployee.endContract
              );
            }
            this.typePosition = this.getPositionText(
              resp.data.data[0].positions.name
            );
            this.positionId = this.getId(resp.data.data[0].positions.name);

            console.log(this.status);
            console.log(resp.data.data);
          });
      } catch (err) {
        console.error(err);
      }
    },
    contractTypeUpdate() {
      this.contract = this.contractType.value;
      console.log(this.contract);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getStatusText(status: any) {
      return status ? 'Active' : 'Resign';
    },
    getPositionText(name: any) {
      const typePosition = this.typePositionOptions.find(
        (option) => option.label === name
      );

      return typePosition ? typePosition.label : null;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getContractText(status: any) {
      const statusOption = this.typeContractOptions.find(
        (option) => option.status === status
      );
      return statusOption ? statusOption.label : null;
      // return status ? 'Active' : 'Resign';
    },
    getRoleText(role: any) {
      const roleType = this.roleTypeOptions.find(
        (option) => option.label === role
      );

      return roleType ? roleType.label : null;
    },
    updateContractId() {
      this.contractBoolean = this.typeContract.status;
      if (this.contractBoolean === false) {
        this.exp = '';
      }
      console.log(this.contractBoolean);
    },
    updatePositionId() {
      this.positionId = this.typePosition.value;
      console.log(this.positionId);
    },
    updateRole() {
      this.role = this.roleType.value;
      console.log(this.role);
    },
    formatDate(dateString: {
      split: (arg0: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map: { (arg0: NumberConstructor): [any, any, any]; new (): any };
      };
    }) {
      const [day, month, year] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-UK', options);
    },

    getId(name: any) {
      const typePosition = this.typePositionOptions.find(
        (option) => option.label === name
      );
      return typePosition ? typePosition.value : null;
    },
    getRoleId(role: any) {
      const roleTypeOptions = this.roleTypeOptions.find(
        (option) => option.label === role
      );

      return roleTypeOptions ? roleTypeOptions.value : null;
    },
    async edit() {
      this.showLoading();
      await api
        .put(
          `/employee/update/${this.id}`,
          {
            name: this.name,
            positionId: this.positionId,
            typeOfEmployee: {
              isContract: this.contractBoolean,
              endContract: this.exp,
              newContract: this.contract,
            },
            roleId: this.role,
          },
          {
            withCredentials: true,
            headers: {
              Accept: '*/*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then((resp) => {
          console.log(resp);

          this.saveNotif(resp.data.message);
        })
        .catch((err) => {
          console.error(err);
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
