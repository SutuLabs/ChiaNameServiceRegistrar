<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          <img src="@/assets/img/cns-logo.svg" class="logo image is-64x64" />
          <span class="is-size-4 logo-title">CNS</span>
        </div>
      </div>
    </nav>
    <div class="mt-10">
      <img src="@/assets/img/icon.png" class="image is-96x96" style="margin: auto" />
      <p class="has-text-centered is-size-2 pt-2 pb-6 has-text-color-cns has-text-weight-bold">Chia Name Service</p>
      <div class="is-flex is-justify-content-center">
        <div class="control has-icons-left">
          <input class="input is-medium search-bar" placeholder="Search for a Chia Domain Name" type="search" :maxlength="40" />
          <div id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <a href="#" class="dropdown-item"> Dropdown item </a>
              <a class="dropdown-item"> Other dropdown item </a>
              <a href="#" class="dropdown-item is-active"> Active dropdown item </a>
              <a href="#" class="dropdown-item"> Other dropdown item </a>
            </div>
          </div>
          <span class="icon is-medium is-left">
            <i class="mdi mdi-magnify mdi-36px"></i>
          </span>
        </div>
        <div>
          <button class="button is-info is-medium">Search</button>
        </div>
      </div>
      <div class="has-text-centered mt-6 is-size-4">
        >> Go to <a class="https://discord.com/invite/uP68PFVWSN" target="_blank">Discord</a> to register your own CNS.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

export default class Search extends Vue {}
</script>
<style scoped lang="scss">
.logo-title {
  font-weight: bold;
  color: #40ac5c;
}

.logo {
  max-height: 10rem;
}

.has-text-color-cns {
  color: #40ac5c;
}

.search-bar {
  min-width: 40vw;
}

.mt-10 {
  margin-top: 8rem;
}
</style>
