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

<style lang="scss">
html {
  height: 100%;
  background-image: url(@/assets/img/cns-background.jpg);
  background-attachment: fixed;
  background-size: cover;
}

.has-text-color-cns {
  color: #40ac5c;
}

.is-cns {
  background-color: #40ac5c;
  border-color: transparent;
  color: #fff;
}
</style>
