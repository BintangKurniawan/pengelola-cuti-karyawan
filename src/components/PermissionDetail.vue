<template>
  <q-btn flat text-color="white" class="" @click="openDialog(id)">
    <Icon icon="mdi:information-outline" width="24" class="text-info" />
  </q-btn>
  <q-dialog v-model="dialog">
    <q-card class="bg-white w-full">
      <q-card-section>
        <p class="text-primary font-semibold text-center">
          {{ name }} Accessed Feature
        </p>
      </q-card-section>
      <q-card-section
        class="border-b border-black"
        v-for="(data, index) in data"
        v-bind:key="index"
      >
        <p class="text-center">{{ data.permission.name }}</p>
      </q-card-section>
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
      name: '',
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
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
