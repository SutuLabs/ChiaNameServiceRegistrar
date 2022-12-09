<template>
  <div>
    <nav class="navbar p-4" role="navigation" aria-label="main navigation">
      <div class="navbar-brand is-clickable" @click="clear()">
        <div class="navbar-item">
          <img src="@/assets/img/cns-logo.svg" class="logo image is-48x48" />
          <span class="is-size-5 logo-title">CNS test</span>
        </div>
      </div>
    </nav>
    <div>
      <div class="mt-10" v-if="!showDetail">
        <img src="@/assets/img/icon.jpg" class="image is-96x96" style="margin: auto" />
        <p class="has-text-centered is-size-3 mt-5 has-text-color-cns has-text-weight-bold">Chia Name Service</p>
        <p class="has-text-centered mb-5 pb-4">
          (Test Only)<i
            class="mdi mdi-help-circle"
            title="Testing is expected to end in December 2022. Please note that all names registered during the test period will be invalid. Welcome to re-register your name after the official launch of CNS."
          ></i>
        </p>
      </div>
      <div class="is-flex is-justify-content-center">
        <div class="control has-icons-left search-bar">
          <input
            class="input"
            placeholder="Search for a Chia Domain Name"
            v-model="name"
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
                  <span class="is-size-6 ml-2 is-flex-grow-2 break-all">{{ name.toLowerCase() }}.xch</span>
                  <span class="has-text-grey is-size-7"> Registered </span>
                </div>
                <div
                  class="is-flex is-align-items-center is-clickable"
                  v-else-if="resolveAns?.status == 'NotFound' && price.price > 0"
                  @click="showResult()"
                >
                  <i class="mdi has-text-success mdi-check-circle mdi-18px"></i>
                  <span class="is-size-6 ml-2 is-flex-grow-2 break-all">{{ name.toLowerCase() }}.xch</span>
                  <span class="has-text-grey is-size-7"> Available </span>
                </div>
                <div class="is-flex is-align-items-center is-clickable" v-else>
                  <i class="mdi has-text-danger mdi-close-circle mdi-18px"></i>
                  <span class="is-size-6 ml-2 is-flex-grow-2 break-all">{{ name.toLowerCase() }}.xch</span>
                  <span class="has-text-grey is-size-7"> Failed </span>
                </div>
              </div>
            </div>
          </div>
          <span class="icon is-left">
            <i class="mdi mdi-magnify mdi-18px"></i>
          </span>
        </div>
        <p class="control">
          <a class="button is-cns is-loading" v-if="isResolving">Loading</a>
          <a class="button is-cns" v-else @click="search()">Search</a>
        </p>
      </div>
      <div v-if="showDetail" class="is-flex is-justify-content-center mt-4 mx-4">
        <div class="column is-5" v-if="resolveAns">
          <span class="is-size-5 has-text-grey mb-4">Result</span>
          <div class="box mt-4" v-if="resolveAns?.status == 'Found'">
            <a class="has-text-link is-size-5 break-all" :href="`https://${name}.xch.cool`" target="_blank"
              >{{ name.toLowerCase() }}.xch<i class="mdi mdi-open-in-new"></i
            ></a>
            <p class="has-text-grey break-all">{{ ownerAddress }}</p>
          </div>
          <div class="card mt-4" v-if="resolveAns?.status == 'NotFound'">
            <header class="card-header">
              <p class="card-header-title break-all">{{ name }}.xch</p>
            </header>
            <div class="card-content">
              <div class="content">
                <p>
                  <span class="is-size-5 has-text-weight-bold">{{ name }}.xch </span
                  ><span class="has-text-success"><i class="mdi mdi-check-circle mdi-18px"></i>AVAILABLE</span>
                </p>
                <p>
                  <span class="is-size-6 has-text-grey">Registration Period</span><span class="is-pulled-right"> 1 Year </span>
                </p>
                <p>
                  <span class="is-size-6 has-text-grey">Registration Price</span
                  ><span class="is-pulled-right">{{ price.price / 1000000000000 }} XCH</span>
                </p>
                <p>
                  <span class="is-size-6 has-text-grey">Royalty Percentage</span
                  ><span class="is-pulled-right">{{ price.royaltyPercentage / 100 }} %</span>
                </p>
                <p>
                  <span class="is-size-6 has-text-grey">Total</span
                  ><span class="is-pulled-right"
                    >{{ (price.price * (10000 + price.royaltyPercentage)) / 10000000000000000 }} XCH</span
                  >
                </p>
              </div>
              <div class="has-text-right"><button class="button is-cns" @click="showModal = true">Register</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="{ modal: true, 'is-active': showModal }">
      <div class="modal-background"></div>
      <div class="modal-card" v-if="!offer">
        <header class="modal-card-head">
          <p class="modal-card-title">Register {{ name }}.xch</p>
          <button class="delete" aria-label="close" @click="showModal = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" disabled :value="name + '.xch'" />
            </div>
          </div>
          <div class="field">
            <label class="label">Address(Optional)</label>
            <div class="control">
              <p class="is-size-7 has-text-grey">If not filled, the owner address will be bound by default.</p>
              <input class="input" type="text" placeholder="xch1..." v-model="address" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot is-block">
          <button class="button" @click="showModal = false">Cancel</button>
          <button
            :class="{ button: true, 'is-cns': true, 'is-pulled-right': true, 'is-loading': registering }"
            @keyup.enter="register()"
            @click="register()"
          >
            Register
          </button>
        </footer>
      </div>
      <div class="modal-card" v-else>
        <header class="modal-card-head">
          <p class="modal-card-title">Select Registration Method</p>
          <button
            class="delete"
            aria-label="close"
            @click="
              showModal = false;
              address = '';
              offer = '';
            "
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="columns is-align-items-start m-3">
            <div class="column is-5 box has-text-centered mr-6 ml-3">
              <i class="mdi mdi-arrow-collapse-down mdi-48px"></i>
              <p class="is-size-5">
                Take Offer <i class="mdi mdi-help-circle" title="You can take this offer in Chia official wallet or Pawket."></i>
              </p>
              <p>
                <a class="mr-4" :href="offerUri" :download="name + '.xch.offer'" @click.stop="">Download</a
                ><a @click.stop="copy(offer)">Copy</a>
              </p>
            </div>
            <div class="column is-5 box has-text-centered is-clickable" @click="openPawket()">
              <img class="p-2" src="@/assets/img/logo-48x48.png" />
              <p class="pb-5 is-size-5">Register by Pawket</p>
            </div>
          </div>
        </section>
      </div>
    </div>
    <footer class="is-fixed-bottom py-4 px-4 has-text-centered has-background-white-ter">
      <a href="https://discord.com/invite/uP68PFVWSN" class="has-text-grey" target="_blank">Discord</a>
      |
      <a href=" https://twitter.com/ChiaNameService" target="_blank" class="has-text-grey">Twitter</a>
    </footer>
  </div>
</template>

<script lang="ts">
import { getPrice, Price, register } from "@/service/cns-register";
import { ResolveFailureAnswer, resolveName, StandardResolveAnswer } from "@/service/resolveName";
import { bech32m } from "@scure/base";
import { Vue } from "vue-class-component";

export default class Search extends Vue {
  public name = "";
  public address = "";
  public resolveAns: StandardResolveAnswer | ResolveFailureAnswer | null = null;
  public isResolving = false;
  public showDetail = false;
  public ownerAddress = "";
  public errorMsg = "";
  public showModal = false;
  public period = 1;
  public price: Price = { price: -1, royaltyPercentage: -1 };
  public registerErrMsg = "";
  public offer = "";
  public registering = false;

  async search(): Promise<void> {
    this.isResolving = true;
    this.name = this.name.split(".")[0];
    if (this.name.length < 6) {
      this.errorMsg = "The name is too short, at least 6 characters are required.";
      this.isResolving = false;
      return;
    }
    this.resolveAns = await resolveName(`${this.name}.xch`);
    if (this.resolveAns.status != "Failure") {
      this.ownerAddress = bech32m.encode(
        "xch",
        bech32m.toWords(this.fromHexString((this.resolveAns as StandardResolveAnswer).data ?? ""))
      );
      if (this.resolveAns.status == "NotFound") await this.getPrice();
    }

    this.isResolving = false;
  }

  showResult(): void {
    this.showDetail = true;
    return;
  }

  async getPrice(): Promise<void> {
    this.price = await getPrice(`${this.name}.xch`);
  }

  async register(): Promise<void> {
    this.registering = true;
    const res = await register(`${this.name}.xch`, this.address);
    if (res?.success) {
      this.offer = res.offer ?? "";
      this.address = "";
    } else {
      this.$notify({
        title: "Register Failed",
        text: res?.reason ?? "Unknown Error",
        type: "error",
        duration: 5000,
      });
    }
    this.registering = false;
  }

  openPawket(): void {
    const baseUrl = "https://kitten.pawket.app/";
    const pawket = window.open(`${baseUrl}#/connect`, "Pawket", "width=390,height=844");
    setTimeout(
      () =>
        pawket?.postMessage(
          JSON.stringify({
            app: "take-offer",
            data: this.offer,
            network: "ccd5bb71183532bff220ba46c268991a3ff07eb358e8255a65c30a2dce0e5fbb",
          }),
          baseUrl
        ),
      2000
    );
  }

  reset(): void {
    this.resolveAns = null;
    1;
    this.errorMsg = "";
  }

  clear(): void {
    this.showDetail = false;
    this.name = "";
    this.resolveAns = null;
    this.errorMsg = "";
    this.registerErrMsg = "";
    this.address = "";
    this.offer = "";
  }

  copy(copyText: string): void {
    const textArea = document.createElement("textarea");
    textArea.value = copyText;

    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
    } catch (err) {
      console.warn("failed to copy: ", err);
    }

    document.body.removeChild(textArea);
    this.$notify("Copied");
  }

  get offerUri(): string {
    const dataPrefix = "data:text/txt;charset=utf-8";
    const content = `${dataPrefix},${this.offer}`;
    return encodeURI(content);
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

.break-all {
  word-break: break-all;
}

.is-fixed-bottom {
  position: fixed;
  bottom: 0;
  width: 100vw;
}
</style>
