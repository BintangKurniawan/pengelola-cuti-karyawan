<template>
  <div>
    <q-btn
      color="primary"
      text-color="white"
      class="capitalize rounded-3xl"
      @click="openDialog"
    >
      <div class="flex items-center justify-center gap-1">
        <Icon icon="mdi:account-plus-outline" size="24" />
        <p>Add Employee</p>
      </div>
    </q-btn>
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-full">
        <q-card-section>
          <h6 class="font-bold text-center">Add Employee</h6>
        </q-card-section>

        <q-card-section class="flex items-center gap-4 w-full justify-between">
          <div class="flex justify-around items-end gap-1 w-full">
            <div class="flex flex-col items-start gap-1 w-[45%]">
              <p class="text-primary font-semibold">NIK</p>
              <q-input
                v-model="nik"
                outlined
                color="dark"
                bg-color="white"
                for="nik"
                placeholder="NIK"
                class="drop-shadow-sm w-full outline-none focus:bg-transparent active:bg-transparent"
              />
            </div>
            <div class="flex flex-col items-start gap-1 w-[45%]">
              <p class="text-primary font-semibold">Name</p>
              <q-input
                v-model="name"
                outlined
                color="dark"
                bg-color="white"
                for="name"
                placeholder="Name"
                class="drop-shadow-sm w-full outline-none focus:bg-transparent active:bg-transparent"
              />
            </div>
          </div>

          <div class="flex justify-around items-end gap-1 w-full">
            <div class="flex flex-col items-start gap-1 w-[45%]">
              <p class="text-primary font-semibold">Email</p>
              <q-input
                v-model="email"
                outlined
                color="dark"
                bg-color="white"
                for="email"
                placeholder="Email"
                class="drop-shadow-sm w-full outline-none focus:bg-transparent active:bg-transparent"
              />
            </div>
            <div class="flex flex-col items-start gap-1 w-[45%]">
              <p class="text-primary font-semibold">Type of Employee</p>
              <q-select
                outlined
                class="w-full"
                label-color="Primary"
                v-model="typeEmployee"
                :options="typeEmployeeOptions"
                @update:model-value="employeeTypeUpdate"
                label="Type Employee"
              >
              </q-select>
            </div>
          </div>

          <div class="flex justify-around items-end gap-1 w-full flex-wrap">
            <div class="flex flex-col items-start gap-1 w-[45%]">
              <p class="text-primary font-semibold">Gender</p>
              <q-select
                outlined
                class="w-full"
                label="Gender"
                v-model="gender"
                :options="genderOptions"
              />
            </div>
            <div class="flex flex-col items-start gap-1 w-[45%]">
              <p class="text-primary font-semibold">Start Working</p>
              <q-input
                outlined
                for="date"
                color="dark"
                type="date"
                bg-color="white"
                class="w-full"
                v-model="startWorking"
              />
            </div>
            <div
              v-if="type === true"
              class="flex flex-col items-start gap-1 w-[45%]"
            >
              <p class="text-primary font-semibold">Expires Contract</p>
              <q-input
                outlined
                for="date"
                color="dark"
                type="date"
                bg-color="white"
                class="w-full"
                v-model="endContract"
              />
            </div>
            <div class="flex flex-col items-start gap-1 w-[45%]">
              <p class="text-primary font-semibold">Position</p>
              <q-select
                outlined
                class="w-full"
                label="Position"
                v-model="typePosition"
                :options="typePositionOptions"
                emit-value
                map-options
              />
            </div>
            <div
              v-if="type === true"
              class="flex flex-col items-start gap-1 w-[45%]"
            >
              <p class="text-primary font-semibold">Employee Status</p>
              <q-select
                outlined
                class="w-full"
                v-model="employeeStatus"
                :options="employeeStatusOptions"
                emit-value
                map-options
                label="Type Contract"
              >
              </q-select>
            </div>
          </div>

          <!-- <div class="flex justify-around items-end gap-1 w-full">
            
          </div> -->

          <q-card-section
            class="flex items-center gap-4 w-full justify-between"
          >
            <div
              class="text-secondary rounded-lg flex items-center gap-2 cursor-pointer"
              @click="dialog = false"
            >
              <Icon icon="mdi:arrow-collapse-left" size="24" />
              Back
            </div>
            <q-btn
              label="Confirm"
              color="primary"
              unelevated
              @click="addEmployee"
              text-color="white"
              class="font-bold round text-center capitalize px-10 py-2"
            />
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import api from 'src/AxiosInterceptors';
import { useQuasar } from 'quasar';
export default {
  setup() {
    const $q = useQuasar();
    return {
      addNotif() {
        $q.notify({
          progress: true,
          position: 'bottom-right',
          message: 'Employee added successfully',
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
    const positionData = localStorage.getItem('position');
    const storedPosition = JSON.parse(positionData);
    const mapPosition = storedPosition.map(
      (position: { id: any; name: any }) => {
        return {
          value: position.id,
          label: position.name,
        };
      }
    );
    return {
      nik: '',
      name: '',
      email: '',
      startWorking: '',
      endContract: '',
      dialog: ref(false),
      mapPosition,
      // FOR SELECTED TYPE CONTRACT FROM Q-SELECT
      typeEmployee: null,
      // FOR SELECT IN Q-SELECT
      typeEmployeeOptions: [
        { value: false, label: 'Permanent' },
        { value: true, label: 'Contract' },
      ],
      // FOR RECEIVED SELECTED typeEmployee VALUE
      type: false,

      // FOR CONTRACT TYPE FROM Q-SELECT
      employeeStatus: ref(false),
      // FOR SELECT IN Q-SELECT
      employeeStatusOptions: [
        { value: false, label: 'Old Employee' },
        { value: true, label: 'New Employee' },
      ],

      // FOR SELECTED POSITION FROM Q-SELECT
      typePosition: ref(null),
      // FOR SELECT IN Q-SELECT, THE DATA IS GAINED FROM API
      typePositionOptions: [],

      gender: null,
      genderOptions: ['L', 'P'],
    };
  },
  props: {
    id: Number,
  },
  components: {
    Icon,
  },

  methods: {
    openDialog() {
      this.dialog = true;
      this.getPosition();
    },
    // TO RECEIVE SELECTED typeEmployee VALUE. IF FALSE (PERMANENT), THE contract IS FALSE (OLD EMPLOYEE) AND NOT HAVE END CONTRACT
    employeeTypeUpdate() {
      this.type = this.typeEmployee.value;
      if (this.type === false) {
        this.employeeStatus = false;
        this.endContract = '';
      }
      console.log(this.type);
    },

    // TO GET POSITION
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
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
            document.location.reload();
          }
        });
    },
    // TO ADD EMPLOYEE
    async addEmployee() {
      await api
        .post(
          '/employee/add',
          {
            nik: this.nik,
            name: this.name,
            email: this.email,
            isContract: this.type,
            startContract: this.startWorking,
            gender: this.gender,
            endContract: this.endContract,
            positionId: this.typePosition,
            newContract: this.employeeStatus,
          },
          {
            headers: {
              Accept: '*/*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then((resp) => {
          this.addNotif();
          console.log(resp);
          // CLEAR DATA
          this.nik = '';
          this.name = '';
          this.email = '';
          this.type = false;
          this.typeEmployee = null;
          this.startWorking = '';
          this.gender = null;
          this.endContract = '';
          this.typePosition = null;
          this.employeeStatus = false;
          this.dialog = false;

          this.$emit('get-data');
        })
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

<style lang="scss" scoped>
.round {
  border-radius: 8px;
}
</style>
