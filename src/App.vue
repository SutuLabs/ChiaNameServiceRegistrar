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
  background-image: url(@/assets/img/cnsbackground.jpg);
  background-attachment: fixed;
  background-size: cover;
}
</style>
