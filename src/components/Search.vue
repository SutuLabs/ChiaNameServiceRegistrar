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
    <div>
      <div class="mt-10" v-if="!showDetail">
        <img src="@/assets/img/icon.png" class="image is-96x96" style="margin: auto" />
        <p class="has-text-centered is-size-2 pt-2 pb-6 has-text-color-cns has-text-weight-bold">Chia Name Service</p>
      </div>
      <div class="is-flex is-justify-content-center">
        <div class="control has-icons-left">
          <input
            class="input is-medium search-bar"
            placeholder="Search for a Chia Domain Name"
            v-model="address"
            type="search"
            :maxlength="63"
            @input.enter="reset()"
            @keyup.enter="search()"
          />
          <p v-if="errorMsg" class="has-text-danger">{{ errorMsg }}</p>
          <div id="dropdown-menu" role="menu" v-if="!showDetail && resolveAns">
            <div class="dropdown-content">
              <div class="dropdown-item">
                <div
                  class="is-flex is-align-items-center is-clickable"
                  v-if="resolveAns?.status == 'Found'"
                  @click="showResult()"
                >
                  <i class="mdi has-text-info mdi-arrow-right-bold-circle mdi-24px"></i>
                  <span class="is-size-4 ml-2 is-flex-grow-2">{{ address }}.xch</span>
                  <span class="has-text-grey is-size-6"> Registered </span>
                </div>
                <div
                  class="is-flex is-align-items-center is-clickable"
                  v-if="resolveAns?.status == 'NotFound'"
                  @click="showResult()"
                >
                  <i class="mdi has-text-success mdi-check-circle mdi-24px"></i>
                  <span class="is-size-4 ml-2 is-flex-grow-2">{{ address }}.xch</span>
                  <span class="has-text-grey is-size-6"> Available </span>
                </div>
                <div
                  class="is-flex is-align-items-center is-clickable"
                  v-if="resolveAns?.status == 'Failure'"
                  @click="showResult()"
                >
                  <i class="mdi has-text-danger mdi-close-circle mdi-24px"></i>
                  <span class="is-size-4 ml-2 is-flex-grow-2">{{ address }}.xch</span>
                  <span class="has-text-grey is-size-6"> Failed </span>
                </div>
              </div>
            </div>
          </div>
          <span class="icon is-medium is-left">
            <i class="mdi mdi-magnify mdi-36px"></i>
          </span>
        </div>
        <div>
          <button class="button is-cns is-medium is-loading" v-if="isResolving">Loading</button>
          <button class="button is-cns is-medium" v-else @click="search()">Search</button>
        </div>
      </div>
      <div v-if="showDetail" class="is-flex is-justify-content-center mt-6">
        <div class="result">
          <span class="is-size-3 has-text-grey mb-4">Result</span>
          <div class="box mt-4" v-if="resolveAns?.status == 'Found'">
            <a class="has-text-link is-size-3" :href="`https://${address}.xch.cool`" target="_blank">{{ address }}.xch</a>
            <p class="has-text-grey">{{ ownerAddress }}</p>
          </div>
          <div class="box mt-4" v-if="resolveAns?.status == 'NotFound'">
            <p class="has-text-success is-size-3">{{ address }}.xch</p>
            <a href="https://discord.com/invite/uP68PFVWSN" target="_blank" class="button is-cns mt-3">Go To Register</a>
          </div>
        </div>
      </div>
      <div class="has-text-centered mt-6 is-size-4">
        >> Go to <a href="https://discord.com/invite/uP68PFVWSN" target="_blank">Discord</a> to register your own CNS.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ResolveFailureAnswer, resolveName, StandardResolveAnswer } from "@/service/resolveName";
import { bech32m } from "@scure/base";
import { Vue } from "vue-class-component";

export default class Search extends Vue {
  public address = "";
  public resolveAns: StandardResolveAnswer | ResolveFailureAnswer | null = null;
  public isResolving = false;
  public showDetail = false;
  public ownerAddress = "";
  public errorMsg = "";

  async search(): Promise<void> {
    this.isResolving = true;
    this.showDetail = false;
    if (this.address.length < 6) {
      this.errorMsg = "The name is too short, at least 6 characters are required.";
      this.isResolving = false;
      return;
    }
    this.resolveAns = await resolveName(`${this.address}.xch`);
    if (this.resolveAns.status != "Failure") {
      this.ownerAddress = bech32m.encode(
        "xch",
        bech32m.toWords(this.fromHexString((this.resolveAns as StandardResolveAnswer).data ?? ""))
      );
    }

    this.isResolving = false;
  }

  showResult(): void {
    this.showDetail = true;
    return;
  }

  reset(): void {
    this.resolveAns = null;
    this.showDetail = false;
    this.errorMsg = "";
  }

  fromHexString(hexString: string): Uint8Array {
    if (!hexString) return new Uint8Array();
    const reg = hexString.match(/.{1,2}/g);
    if (!reg) return new Uint8Array();
    return new Uint8Array(reg.map((byte) => parseInt(byte, 16)));
  }
}
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

.is-cns {
  background-color: #40ac5c;
  border-color: transparent;
  color: #fff;
}
.search-bar {
  min-width: 40vw;
}

.result {
  min-width: 44vw;
}

.mt-10 {
  margin-top: 8rem;
}
</style>
