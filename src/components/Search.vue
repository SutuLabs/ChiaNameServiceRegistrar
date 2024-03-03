<template>
  <div>
    <nav class="navbar p-4" role="navigation" aria-label="main navigation">
      <div class="navbar-brand is-clickable" @click="clear()">
        <div class="navbar-item">
          <img src="@/assets/img/cns-logo.png" class="logo image is-48x48" />
          <span class="is-size-5 has-text-weight-bold has-text-white">CNS</span>
        </div>
      </div>
    </nav>
    <div>
      <div class="mt-10" v-if="!showDetail">
        <img src="@/assets/img/cns-logo.png" class="image is-96x96" style="margin: auto" />
        <p class="has-text-centered is-size-3 my-5 has-text-white has-text-weight-bold">
          Chia Name Service
          <span class="mb-3 is-size-7 has-text-weight-normal">
            {{ NetworkHint }}
          </span>
        </p>
      </div>
      <div class="is-flex is-justify-content-center max-w-90">
        <div class="control has-icons-left search-bar">
          <input
            class="input is-medium"
            placeholder="Search for a Chia Domain Name"
            v-model="name"
            type="search"
            :maxlength="63"
            @input.enter="reset()"
            @keyup.enter="search()"
          />
          <span class="icon is-left">
            <i class="mdi mdi-magnify mdi-24px"></i>
          </span>
        </div>
        <p class="control">
          <a class="button is-cns is-loading is-medium" v-if="isResolving">Loading</a>
          <a class="button is-cns is-medium" v-else @click="search()">Search</a>
        </p>
      </div>
      <div v-if="showDetail && !isResolving" class="is-flex is-justify-content-center mt-4 mx-4">
        <div class="column is-5" v-if="resolveAns">
          <span class="is-size-5 has-text-white mb-4">Result</span>
          <div class="card mt-4" v-if="name.length < 6">
            <header class="card-header">
              <p class="card-header-title break-all">{{ name.toLocaleLowerCase() }}.xch</p>
            </header>
            <div class="card-content" v-if="name.length < 6">
              <div class="content">
                <p>
                  <span class="is-size-5 has-text-weight-bold">{{ name.toLocaleLowerCase() }}.xch </span
                  ><span class="has-text-warning"><i class="mdi mdi-dots-horizontal-circle mdi-18px"></i>Not Open Yet</span>
                </p>
                During the trial operation period of CNS, only names with 6 or more characters can be registered for the time
                being. In the future, the registration of all names will be gradually opened. Stay tuned!
              </div>
            </div>
          </div>
          <div class="card mt-4" v-else-if="resolveAns?.status == 'Found'">
            <header class="card-header">
              <p class="card-header-title break-all">
                <a
                  class="has-text-link is-size-5 break-all"
                  :href="`https://${name.toLocaleLowerCase()}.xch.cool`"
                  target="_blank"
                  >{{ name }}.xch<i class="mdi mdi-open-in-new"></i
                ></a>
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                <p>
                  <span class="is-size-5 has-text-weight-bold">{{ name.toLocaleLowerCase() }}.xch </span
                  ><span class="has-text-info"><i class="mdi mdi-arrow-right-bold-circle mdi-18px"></i>Registered</span>
                </p>
                This name has been registered. Go to view
                <a class="has-text-link" :href="`https://${name.toLocaleLowerCase()}.xch.cool`" target="_blank"
                  >Profile Homepage<i class="mdi mdi-open-in-new"></i></a
                >.
              </div>
            </div>
          </div>
          <div class="card mt-4" v-else-if="resolveAns?.status == 'NotFound' && price.price > 0">
            <header class="card-header">
              <p class="card-header-title break-all">{{ name.toLocaleLowerCase() }}.xch</p>
            </header>
            <div class="card-content">
              <div class="content">
                <p>
                  <span class="is-size-5 has-text-weight-bold break-all">{{ name.toLocaleLowerCase() }}.xch </span
                  ><span class="has-text-success"><i class="mdi mdi-check-circle mdi-18px"></i>Available</span>
                </p>
                <p>
                  <span class="is-size-6 has-text-grey">Registration Period</span><span class="is-pulled-right"> 1 Year </span>
                </p>
                <p>
                  <span class="is-size-6 has-text-grey">Registration Fee</span
                  ><span class="is-pulled-right">{{ price.registrationFee / 1000000000000 }} XCH</span>
                </p>
                <p>
                  <span class="is-size-6 has-text-grey">Annual Fee</span
                  ><span class="is-pulled-right">{{ price.annualFee / 1000000000000 }} XCH</span>
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
          <div class="card mt-4" v-else-if="resolveAns.status == 'Failure' || !price.name">
            <header class="card-header">
              <p class="card-header-title break-all">{{ name.toLocaleLowerCase() }}.xch</p>
            </header>
            <div class="card-content">
              <div class="content">
                <p>
                  <span class="is-size-5 has-text-weight-bold break-all">{{ name.toLocaleLowerCase() }}.xch </span
                  ><span class="has-text-danger"><i class="mdi mdi-alert-circle mdi-18px"></i>Network issue</span>
                </p>
              </div>
            </div>
          </div>
          <div class="card mt-4" v-else>
            <header class="card-header">
              <p class="card-header-title break-all">{{ name.toLocaleLowerCase() }}.xch</p>
            </header>
            <div class="card-content">
              <div class="content">
                <p>
                  <span class="is-size-5 has-text-weight-bold break-all">{{ name.toLocaleLowerCase() }}.xch </span
                  ><span class="has-text-danger"><i class="mdi mdi-close-circle mdi-18px"></i>Unavailable</span>
                </p>
                <span class="has-text-danger" v-if="price.code && price.code == 'NameUnavailable'"
                  >This name is reserved. If you can prove that you are the owner of the name/trademark/brand, please contact us
                  via Twitter/Discord.</span
                >
                <span class="has-text-danger" v-else>{{ price.reason }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="{ modal: true, 'is-active': showModal }">
      <div class="modal-background"></div>
      <div class="modal-card" v-if="!offer">
        <header class="modal-card-head">
          <p class="modal-card-title">Register {{ name.toLocaleLowerCase() }}.xch</p>
          <button class="delete" aria-label="close" @click="showModal = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" disabled :value="name.toLocaleLowerCase() + '.xch'" />
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
          <div class="is-pulled-right">
            <span v-if="registering" class="has-text-color-cns is-size-7 has-text-right">
              Please wait a moment while the offer is being generated.
            </span>
            <button
              :class="{ button: true, 'is-cns': true, 'is-loading': registering }"
              @keyup.enter="register()"
              @click="register()"
            >
              Register
            </button>
          </div>
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
              <a class="mr-4 has-text-dark" :href="offerUri" :download="name.toLocaleLowerCase() + '.xch.offer'" @click.stop=""
                ><i class="mdi mdi-arrow-collapse-down mdi-48px"></i
              ></a>
              <p class="is-size-5">Take Offer</p>
              <p>
                <a class="mr-4" :href="offerUri" :download="name.toLocaleLowerCase() + '.xch.offer'" @click.stop="">Download</a
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
    <Ranking v-if="!showDetail" class="mt-12rem" />
    <footer class="mt-6 pb-4 px-4 has-text-centered">
      <a href="https://discord.com/invite/uP68PFVWSN" class="has-text-white" target="_blank">Discord</a>
      <a href=" https://twitter.com/ChiaNameService" target="_blank" class="has-text-white"> | Twitter</a>
      <a target="_blank" class="has-text-white" href="https://sutulabs.github.io/CNSWhitepaper/Faq.html"> | FAQ </a>
      <p class="has-text-white">Trademark is licensed</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { getPrice, Price, register } from "@/service/cns-register";
import { ResolveFailureAnswer, resolveName, StandardResolveAnswer } from "@/service/resolveName";
import { copy } from "@/service/utility";
import { bech32m } from "@scure/base";
import { Options, Vue } from "vue-class-component";
import Ranking from "./Ranking.vue";
import { Pawket } from "pawket-js-sdk";

@Options({
  components: {
    Ranking,
  },
})
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
  public price: Price = { name: "", price: -1, annualFee: -1, royaltyPercentage: -1, registrationFee: -1 };
  public registerErrMsg = "";
  public offer = "";
  public registering = false;

  get NetworkHint(): string {
    return window.location.host == process.env.VUE_APP_MAINNET_HOST ? "" : "testnet";
  }

  async search(): Promise<void> {
    this.isResolving = true;
    this.name = this.name.replace(/\s/g, "");
    this.name = this.name.split(".")[0];
    this.resolveAns = await resolveName(`${this.name}.xch`);
    if (this.resolveAns.status != "Failure") {
      this.ownerAddress = bech32m.encode(
        "xch",
        bech32m.toWords(this.fromHexString((this.resolveAns as StandardResolveAnswer).data ?? ""))
      );
      if (this.resolveAns.status == "NotFound") await this.getPrice();
    }
    this.showDetail = true;
    this.isResolving = false;
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

  async openPawket(): Promise<void> {
    const baseUrl = "https://pawket.app/";
    const client = new Pawket({ baseUrl });
    try {
      const msg = await client.takeOffer(this.offer);
      console.log(msg);
    } catch (error) {
      console.warn(error);
    }
  }

  reset(): void {
    this.resolveAns = null;
    this.price = { name: "", price: -1, annualFee: -1, royaltyPercentage: -1, registrationFee: -1 };
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
    copy(copyText);
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
.logo {
  max-height: 10rem;
}

.search-bar {
  min-width: 40vw;
}

.max-w-90 {
  max-width: 90vw;
  margin: auto;
}

.mt-10 {
  margin-top: 8vh;
}

.mt-12rem {
  margin-top: 12rem;
}

.break-all {
  word-break: break-all;
}

.navbar {
  background-color: transparent;
}

.is-cns {
  background-color: #40ac5c;
  border-color: transparent;
  color: #fff;
}
</style>
