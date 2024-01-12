<template>
  <div class="flex justify-center items-center w-full">
    <div class="flex flex-wrap items-center w-full">
      <q-expansion-item
        v-for="(item, i) in libur"
        :label="item.judul"
        class="w-[50%] font-bold"
        v-bind:key="i"
      >
        <div class="flex items-center">
          <p class="px-4 text-xs">
            {{ formatDate(item.start) }} - {{ formatDate(item.end) }}
          </p>
          <Acc :id="item.id" />
        </div>
      </q-expansion-item>
    </div>
  </div>
</template>

<script>
// import { defineProps, ref } from 'vue'
// import { Icon } from '@iconify/vue'
import Acc from 'src/components/AccBtn.vue';
export default {
  setup() {
    const libur = [
      {
        id: 1,
        judul: 'Idul FItri',
        start: '2022-05-12',
        end: '2022-05-13',
      },
      {
        id: 2,
        judul: 'Idul FItri',
        start: '2022-05-12',
        end: '2022-05-13',
      },
      {
        id: 3,
        judul: 'Idul FItri',
        start: '2022-05-12',
        end: '2022-05-13',
      },
      {
        id: 4,
        judul: 'Idul FItri',
        start: '2022-05-12',
        end: '2022-12-13',
      },
      {
        id: 5,
        judul: 'Idul FItri',
        start: '2022-05-12',
        end: '2022-05-13',
      },
    ];

    return {
      libur,
    };
  },
  data() {
    return {};
  },
  methods: {
    formatDate(dateString) {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-UK', options);
    },

    acc(id) {
      console.log(id);
    },
  },
  components: {
    // Icon,
    Acc,
  },
};
</script>

<style lang="scss" scoped></style>
