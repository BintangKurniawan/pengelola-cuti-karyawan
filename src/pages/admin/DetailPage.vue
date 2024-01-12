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
          bg-color="white"
          for="startWork"
          readonly
          placeholder="Start Working"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4">
        <h5 class="font-semibold text-2xl">Contract Expires</h5>
        <q-input
          outlined
          color="dark"
          bg-color="white"
          for="expires"
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
          placeholder="Type of Employee"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>

      <div class="flex flex-col gap-4 h-[104px] justify-end">
        <q-btn
          color="primary"
          text-color="white"
          label="Edit Profile"
          class="w-[270px] h-[56px] rounded-3xl"
          @click="$router.push('/admin/detail/edit')"
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
          placeholder="NIK"
          class="drop-shadow-sm w-[270px] outline-none focus:bg-transparent active:bg-transparent"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
    };
  },
};
</script>

<style lang="scss" scoped></style>
