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
          disable=""
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
          v-model="position"
          placeholder="Position"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Status</h5>
        <div
          class="text-positive bg-[#EBF9F1] w-[270px] px-3 py-4 rounded-[4px]"
        >
          Active
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Start Working</h5>
        <q-input
          outlined
          color="dark"
          bg-color="grey-2"
          for="startWork"
          disable
          placeholder="Start Working"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Contract Expires</h5>
        <q-input
          outlined
          for="date"
          color="dark"
          type="date"
          bg-color="white"
          class="w-[270px]"
          v-model="expires"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Type of Employee</h5>
        <q-select
          outlined
          class="w-[270px]"
          label-color="Primary"
          v-model="typeContract"
          :options="typeContractOptions"
          @update:model-value="tes"
          label="Type Employee"
        ></q-select>
      </div>

      <div class="flex flex-col gap-4 h-[104px] justify-end">
        <q-btn
          color="primary"
          text-color="white"
          label="Save Changes"
          class="w-[270px] h-[56px] capitalize rounded-3xl"
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
          placeholder="Email"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col h-[104px] justify-end">
        <Reset />
      </div>
    </div>
  </div>
</template>

<script>
import Reset from 'src/components/ResetBtn.vue';

export default {
  data() {
    return {
      name: '',
      position: '',
      expires: '',
      typeContract: null,
      typeContractOptions: [
        { value: 1, label: 'Permanent' },
        { value: 2, label: 'Contract' },
      ],
    };
  },
  components: { Reset },
};
</script>

<style lang="scss" scoped></style>
