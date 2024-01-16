<template>
  <div>
    <q-btn
      dense
      flat
      class="flex items-start w-full md:w-fit hover:bg-gray-100 p-4"
      @click="dialog = true"
    >
      <div class="flex items-center gap-4">
        <Icon icon="mdi:cog-outline" width="24" />
        <p class="capitalize">Setting</p>
      </div>
    </q-btn>
    <q-dialog v-model="dialog">
      <q-card class="bg-white w-full">
        <q-card-section>
          <h6 class="font-bold text-center">Settings</h6>
        </q-card-section>

        <q-card-section class="flex items-center gap-4 w-full justify-between">
          <div class="flex justify-around items-end gap-2 w-full">
            <div class="flex flex-col items-start gap-1">
              <p class="text-primary font-semibold">Name</p>
              <q-input
                v-model="name"
                outlined
                color="dark"
                bg-color="white"
                for="name"
                placeholder="Name"
                class="drop-shadow-sm w-44 outline-none focus:bg-transparent active:bg-transparent"
              />
            </div>

            <q-btn
              label="Save Change"
              unelevated
              text-color="positive"
              class="font-bold round text-center capitalize px-4 py-2"
            />
          </div>
          <div class="flex justify-around items-end gap-5 w-full">
            <div class="flex flex-col items-start gap-1">
              <p class="text-primary font-semibold">Password</p>
              <q-input
                v-model="password"
                outlined
                color="dark"
                bg-color="white"
                label="Password"
                :type="passwordFieldType"
                for="password"
                placeholder="Password"
                class="w-44 drop-shadow-sm outline-none focus:bg-transparent active:bg-transparent"
              >
                <template v-slot:append>
                  <Icon
                    :icon="
                      passwordFieldType === 'password'
                        ? 'mdi:eye-outline'
                        : 'mdi:eye-off-outline'
                    "
                    @click="togglePasswordVisibility"
                    class="cursor-pointer text-secondary"
                  /> </template
              ></q-input>
            </div>

            <q-btn
              @click="modal = true"
              label="Change"
              unelevated
              color="primary"
              text-color="white"
              class="font-bold round text-center capitalize px-4 py-2 w-[120px]"
            />
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
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modal">
      <q-card class="bg-white">
        <q-card-section>
          <h6 class="font-bold text-center">Change Password</h6>
        </q-card-section>

        <q-card-section>
          <p class="text-center text-[#a0a0a0]">
            Are you sure want to change your password?
          </p>
        </q-card-section>

        <q-card-section class="flex items-center gap-4 w-full justify-between">
          <div
            class="text-secondary rounded-lg flex items-center gap-2 cursor-pointer"
            @click="modal = false"
          >
            <Icon icon="mdi:arrow-collapse-left" size="24" />
            Back
          </div>
          <q-btn
            label="Yes"
            unelevated
            text-color="positive"
            class="font-bold round text-center capitalize px-10 py-2"
          />
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
      dialog: ref(false),
      modal: ref(false),
      name: '',
      password: '',
      passwordFieldType: 'password',
    };
  },
  components: {
    Icon,
  },

  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    },
  },
};
</script>

<style lang="scss" scoped>
.round {
  background-color: #ebf9f1;
  border-radius: 8px;
}
</style>
