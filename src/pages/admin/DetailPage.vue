<template>
  <div class="flex justify-center items-center">
    <div class="flex flex-wrap items-center gap-4 w-[1128px]">
      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">NIK</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="nik"
          readonly
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
          bg-color="white"
          for="name"
          v-model="name"
          readonly
          placeholder="Name"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Position</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="position"
          readonly
          v-model="position"
          placeholder="Position"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
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
          bg-color="white"
          for="startWork"
          v-model="start"
          readonly
          placeholder="Start Working"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4" v-if="expDate">
        <h5 class="font-semibold text-2xl">Contract Expires</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="expires"
          v-model="expires"
          readonly
          placeholder="Contract Expires"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Type of Employee</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="type"
          readonly
          v-model="type"
          placeholder="Type of Employee"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Role</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="role"
          readonly
          v-model="role"
          placeholder="Role"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Email</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="email"
          readonly
          v-model="email"
          placeholder="Email"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Admin who Added</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="admin"
          readonly
          v-model="historicalName"
          placeholder="Admin"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Admin's NIK</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="adminNik"
          readonly
          v-model="historicalNik"
          placeholder="NIK"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4 h-[104px] justify-end">
        <q-btn
          color="primary"
          text-color="white"
          label="Edit Profile"
          class="w-[270px] h-[56px] rounded-3xl"
          @click="$router.push(`/admin/detail/${id}/edit`)"
        />
      </div>

      <div class="flex flex-col h-[104px] justify-end">
        <ActivateBtn :id="id" />
      </div>
    </div>
  </div>
</template>

<script>
import api from 'src/AxiosInterceptors';
import { useRoute } from 'vue-router';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import moment from 'moment';
import ActivateBtn from 'src/components/ActivateBtn.vue';
export default {
  setup() {
    const route = useRoute();
    //  TO GET ID FROM ROUTE
    const id = route.params.id;
    return {
      id,
    };
  },
  mounted() {
    // TO GET DATA
    this.getData();
  },
  data() {
    return {
      name: '',
      nik: '',
      position: '',
      email: '',
      start: '',
      expires: '',
      status: '',
      historicalName: '',
      historicalNik: '',
      type: '',
      role: '',

      // FOR NEW CONTRACT, IS NEW OR FALSE
      expDate: false,
    };
  },
  methods: {
    // TO GET DATA
    async getData() {
      try {
        await api
          .get(`/employee/detail/${this.id}`, {
            withCredentials: true,
          })
          .then((resp) => {
            this.nik = resp.data.data[0].nik;
            this.name = resp.data.data[0].name;
            this.position = resp.data.data[0].positions.name;
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
            this.status = this.getStatusText(resp.data.data[0].isWorking);
            this.type = this.getContractText(
              resp.data.data[0].typeOfEmployee.isContract
            );
            this.expDate = resp.data.data[0].typeOfEmployee.isContract;
            this.historicalName = resp.data.data[0].historicalName;
            this.historicalNik = resp.data.data[0].historicalNik;
            console.log(this.status);
            console.log(resp.data.data);
            console.log(this.historicalName);
          });
      } catch (err) {
        console.error(err);
      }
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
  },
  components: { ActivateBtn },
};
</script>

<style lang="scss" scoped></style>
