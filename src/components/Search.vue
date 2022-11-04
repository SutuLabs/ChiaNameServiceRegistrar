<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand is-clickable" @click="clear()">
        <div class="navbar-item">
          <img src="@/assets/img/cns-logo.svg" class="logo image is-48x48" />
          <span class="is-size-5 logo-title">CNS</span>
        </div>
      </div>
    </nav>
    <div>
      <div class="mt-10" v-if="!showDetail">
        <img src="@/assets/img/icon.png" class="image is-96x96" style="margin: auto" />
        <p class="has-text-centered is-size-3 mt-5 mb-5 pb-4 has-text-color-cns has-text-weight-bold">Chia Name Service</p>
      </div>
      <div class="is-flex is-justify-content-center">
        <div class="control has-icons-left search-bar">
          <input
            class="input"
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
                  <i class="mdi has-text-info mdi-arrow-right-bold-circle mdi-18px"></i>
                  <span class="is-size-6 ml-2 is-flex-grow-2">{{ address }}.xch</span>
                  <span class="has-text-grey is-size-7"> Registered </span>
                </div>
                <div
                  class="is-flex is-align-items-center is-clickable"
                  v-if="resolveAns?.status == 'NotFound'"
                  @click="showResult()"
                >
                  <i class="mdi has-text-success mdi-check-circle mdi-18px"></i>
                  <span class="is-size-6 ml-2 is-flex-grow-2">{{ address }}.xch</span>
                  <span class="has-text-grey is-size-7"> Available </span>
                </div>
                <div class="is-flex is-align-items-center is-clickable" v-if="resolveAns?.status == 'Failure'">
                  <i class="mdi has-text-danger mdi-close-circle mdi-18px"></i>
                  <span class="is-size-6 ml-2 is-flex-grow-2">{{ address }}.xch</span>
                  <span class="has-text-grey is-size-7"> Failed </span>
                </div>
              </div>
            </div>
          </div>
          <span class="icon is-left">
            <i class="mdi mdi-magnify mdi-18px"></i>
          </span>
        </div>
        <div>
          <button class="button is-cns is-loading" v-if="isResolving">Loading</button>
          <button class="button is-cns" v-else @click="search()">Search</button>
        </div>
      </div>
      <div v-if="showDetail" class="is-flex is-justify-content-center mt-4 mx-4">
        <div class="column is-5" v-if="resolveAns">
          <span class="is-size-5 has-text-grey mb-4">Result</span>
          <div class="box mt-4" v-if="resolveAns?.status == 'Found'">
            <a class="has-text-link is-size-5" :href="`https://${address}.xch.cool`" target="_blank">{{ address }}.xch</a>
            <p class="has-text-grey">{{ ownerAddress }}</p>
          </div>
          <div class="box mt-4" v-if="resolveAns?.status == 'NotFound'">
            <p class="has-text-success is-size-5">{{ address }}.xch</p>
            <a href="https://discord.com/invite/uP68PFVWSN" target="_blank" class="button is-cns mt-3">Go to Register</a>
          </div>
        </div>
      </div>
      <div class="has-text-centered mt-5 pt-4 is-size-6">
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
    this.errorMsg = "";
  }

  clear(): void {
    this.showDetail = false;
    this.address = "";
    this.resolveAns = null;
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

.search-bar {
  min-width: 40vw;
}

.has-text-color-cns {
  color: #40ac5c;
}

.is-cns {
  background-color: #40ac5c;
  border-color: transparent;
  color: #fff;
}

.mt-10 {
  margin-top: 8vh;
}
</style>
