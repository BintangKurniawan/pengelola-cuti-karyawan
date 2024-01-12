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
                v-model="typeContract"
                :options="typeContractOptions"
                @update:model-value="tes"
                label="Type Employee"
              >
              </q-select>
            </div>
          </div>

          <div class="flex justify-around items-end gap-1 w-full">
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
              v-if="type === 2"
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
          </div>

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
              text-color="white"
              class="font-bold round text-center capitalize px-10 py-2"
            />
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
export default {
  data() {
    return {
      nik: '',
      name: '',
      email: '',
      startWorking: '',
      endContract: '',
      type: 0,
      dialog: ref(false),
      typeContract: null,
      typeContractOptions: [
        { value: 1, label: 'Permanent' },
        { value: 2, label: 'Contract' },
      ],
    };
  },
  props: {
    id: Number,
  },
  components: {
    Icon,
  },

  methods: {
    tes() {
      this.type = this.typeContract.value;
      console.log(this.type);
    },
  },
};
</script>

<style lang="scss" scoped>
.round {
  border-radius: 8px;
}
</style>
