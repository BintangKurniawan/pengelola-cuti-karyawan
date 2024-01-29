<template>
  <div>
    <q-btn
      color="primary"
      text-color="white"
      class="capitalize rounded-3xl"
      @click="dialog = true"
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
              <!-- <q-input
                v-model="name"
                outlined
                color="dark"
                bg-color="white"
                for="name"
                placeholder="Name"
                class="drop-shadow-sm w-full outline-none focus:bg-transparent active:bg-transparent" /> -->
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
                @update:model-value="positionIdUpdate"
              />
            </div>
            <div
              v-if="type === true"
              class="flex flex-col items-start gap-1 w-[45%]"
            >
              <p class="text-primary font-semibold">Type of Contract</p>
              <q-select
                outlined
                class="w-full"
                v-model="typeContract"
                :options="typeContractOptions"
                @update:model-value="contractTypeUpdate"
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
      nik: '',
      name: '',
      email: '',
      startWorking: '',
      endContract: '',
      dialog: ref(false),

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
      typeContract: null,
      // FOR SELECT IN Q-SELECT
      typeContractOptions: [
        { value: false, label: 'Old Employee' },
        { value: true, label: 'New Employee' },
      ],
      // TO RECEIVED VALUE FROM SELECTED typeContract
      contract: false,

      // FOR SELECTED POSITION FROM Q-SELECT
      typePosition: null,
      // FOR SELECT IN Q-SELECT, THE DATA IS GAINED FROM API
      typePositionOptions: [],
      // TO RECEIVED POSITION ID FROM SELECTED typePosition
      positionId: '',
    };
  },
  props: {
    id: Number,
  },
  components: {
    Icon,
  },
  async mounted() {
    // TO GET POSITION DATA
    await this.getPosition();
  },
  methods: {
    // TO RECEIVE SELECTED typeEmployee VALUE. IF FALSE (PERMANENT), THE contract IS FALSE (OLD EMPLOYEE) AND NOT HAVE END CONTRACT
    employeeTypeUpdate() {
      this.type = this.typeEmployee.value;
      if (this.type === false) {
        this.contract = false;
        this.endContract = '';
      }
      console.log(this.type);
    },
    // TO RECCEIVE SELECTED typeContract VALUE. IS OLD OR NEW
    contractTypeUpdate() {
      this.contract = this.typeContract.value;
      console.log(this.contract);
    },
    // TO RECEIVE SELECTED typePosition VALUE
    positionIdUpdate() {
      this.positionId = this.typePosition.value;
      console.log(this.positionId);
    },
    // TO GET POSITION
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
            endContract: this.endContract,
            positionId: this.positionId,
            newContract: this.contract,
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
          this.addNotif();
          console.log(resp);
          // CLEAR DATA
          this.dialog = false;
          this.nik = '';
          this.name = '';
          this.email = '';
          this.type = false;
          this.startWorking = '';
          this.endContract = '';
          this.positionId = '';
          this.contract = false;
          setInterval(() => {
            document.location.reload();
          }, 2000);
        })
        .catch((err) => {
          if (err.response) {
            const msg = err.response.data.message;
            this.failedNotif(msg);
            document.location.reload();
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
