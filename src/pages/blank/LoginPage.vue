<template>
  <q-page class="flex justify-center gap-16 flex-col items-center text-center">
    <q-img
      src="../../assets/img/logo_wgs_fullBlack.svg"
      class="w-[276px] h-[62px]"
    />

    <div class="flex flex-col gap-8 items-center">
      <q-input
        rounded
        v-model="email"
        outlined
        color="dark"
        bg-color="white"
        label="Email"
        for="email"
        placeholder="Email"
        class="md:w-80 w-60 drop-shadow-sm outline-none focus:bg-transparent active:bg-transparent"
      />

      <q-input
        rounded
        v-model="password"
        outlined
        color="dark"
        bg-color="white"
        label="Password"
        :type="passwordFieldType"
        for="password"
        placeholder="Password"
        class="md:w-80 w-60 drop-shadow-sm outline-none focus:bg-transparent active:bg-transparent"
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

      <q-btn
        text-color="white"
        unelevated
        size="md"
        rounded
        padding="sm"
        color="primary"
        label="login"
        class="px-[88px] py-4 w-60 text-2xl items-center text-bold"
      >
      </q-btn>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Icon } from '@iconify/vue';
export default {
  components: {
    Icon,
  },
  setup() {
    return {};
  },
  data() {
    return {
      email: '',
      password: '',
      passwordFieldType: 'password',
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    },
  },
};
</script>

<style lang="scss" scoped></style>
