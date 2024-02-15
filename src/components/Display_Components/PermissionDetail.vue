<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <q-btn flat text-color="white" class="" @click="openDialog(id)">
    <Icon icon="mdi:information-outline" width="24" class="text-info" />
  </q-btn>
  <q-dialog v-model="dialog">
    <q-card class="bg-white w-full h-full">
      <div
        class="w-full border-b-2 md:flex items-center justify-center gap-4 pt-4"
      >
        <div
          @click="switchTable = true"
          class="cursor-pointer group relative transition-all"
          :class="{ 'text-primary font-semibold': switchTable }"
        >
          <span
            class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300"
            :class="switchTable ? 'w-full' : 'w-0'"
            >&nbsp;</span
          >
          Accessed Feature
        </div>
        <div
          v-if="dataUser.length >= 1"
          @click="switchTable = false"
          class="cursor-pointer group relative transition-all"
          :class="{ 'text-primary font-semibold': !switchTable }"
        >
          <span
            class="h-[2px] inline-block bg-primary absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300"
            :class="!switchTable ? 'w-full' : 'w-0'"
            >&nbsp;</span
          >
          User Count
        </div>
      </div>

      <div class="h-[90%] overflow-y-scroll w-full" v-if="switchTable">
        <q-card-section
          class="border-b border-black"
          v-for="(data, index) in data"
          v-bind:key="index"
        >
          <p class="text-center">{{ data.permission.name }}</p>
        </q-card-section>
      </div>
      <div class="h-[90%] overflow-y-scroll w-full" v-else>
        <div
          class="border-b border-black p-3"
          v-for="(data, i) in dataUser"
          v-bind:key="i"
        >
          <p class="text-center">{{ data.employee.name }}</p>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import api from 'src/AxiosInterceptors';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
export default {
  components: {
    Icon,
  },
  props: {
    count: Number,
    id: Number,
  },
  data() {
    return {
      dialog: ref(false),
      data: [],
      dataUser: [],
      name: '',
      switchTable: ref(true),
    };
  },
  methods: {
    openDialog(id) {
      this.dialog = true;
      this.getData(id);
    },
    async getData(id) {
      await api
        .get(`/role/${id}`, { withCredentials: true })
        .then((res) => {
          console.log(res);
          this.name = res.data.data.name;
          this.data = res.data.data.rolePermissions;
          this.dataUser = res.data.data.users;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
