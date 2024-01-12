<template>
  <div class="flex justify-center items-center w-full">
    <div class="flex flex-wrap items-center w-full">
      <q-expansion-item
        v-for="(item, i) in libur"
        :label="item.judul"
        class="w-[50%] font-bold"
        v-bind:key="i"
      >
        <p class="px-4 text-xs">
          {{ formatDate(item.start) }} - {{ formatDate(item.end) }}
        </p>
      </q-expansion-item>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const libur = [
      {
        judul: 'Idul FItri',
        start: '2022-05-12',
        end: '2022-05-13',
      },
      {
        judul: 'Idul FItri',
        start: '2022-05-12',
        end: '2022-05-13',
      },
      {
        judul: 'Idul FItri',
        start: '2022-05-12',
        end: '2022-05-13',
      },
      {
        judul: 'Idul FItri',
        start: '2022-05-12',
        end: '2022-12-13',
      },
      {
        judul: 'Idul FItri',
        start: '2022-05-12',
        end: '2022-05-13',
      },
    ];

    return {
      libur,
    };
  },
  methods: {
    formatDate(dateString) {
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('en-UK', options);
    },
  },
};
</script>

<style lang="scss" scoped></style>
