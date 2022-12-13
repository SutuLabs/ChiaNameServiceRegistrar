<template>
  <Search />
  <notifications />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Search from "./components/Search.vue";

@Options({
  components: {
    Search,
  },
})
export default class App extends Vue {}
</script>

<style>
html {
  height: 100%;
  background-image: linear-gradient(#83f4a0, #68c781, #3fe8ad, #6db4d1);
}
</style>
