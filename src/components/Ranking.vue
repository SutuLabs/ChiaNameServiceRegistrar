<template>
  <div>
    <div class="is-size-3 has-text-centered has-text-white my-4">Ranking List</div>
    <div class="columns is-mobile is-multiline">
      <div class="column is-4-widescreen is-12-desktop is-offset-2-widescreen">
        <table class="table is-fullwidth is-hoverable is-striped transparent">
          <thead>
            <tr>
              <th><p class="is-size-5">Top Holders</p></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Balance</th>
              <th>Binding Address</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(holder, index) in topHolders" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <p v-for="name of holder.names.split(',')" :key="name" class="mb-1">
                  {{ name }}
                  <a :href="`https://${name.toLocaleLowerCase()}.cool`" target="_blank" class="has-text-dark"
                    ><i class="mdi mdi-open-in-new"></i
                  ></a>
                </p>
              </td>
              <td>{{ BigInt(holder.balance) / 1000000000000n }} XCH</td>
              <td>
                <span :data-tooltip="getAddressFromPuzzleHash(holder.puzzle_hash)" class="mr-2">{{
                  shorten(getAddressFromPuzzleHash(holder.puzzle_hash))
                }}</span>
                <a href="javascript:void(0)" @click="copy(getAddressFromPuzzleHash(holder.puzzle_hash))"
                  ><i class="mdi mdi-content-copy"></i
                ></a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="column is-4-widescreen is-12-desktop">
        <table class="table is-fullwidth is-hoverable is-striped transparent">
          <thead>
            <tr>
              <th><p class="is-size-5">Last Minted</p></th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <th>Name</th>
              <th>Recipient Address</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cns of lastMinted" :key="cns.name">
              <td>{{ cns.name }}</td>
              <td>
                <span :data-tooltip="getAddressFromPuzzleHash(cns.nft_coin_name)" class="mr-2">{{
                  shorten(getAddressFromPuzzleHash(cns.nft_coin_name))
                }}</span>
                <a href="javascript:void(0)" @click="copy(getAddressFromPuzzleHash(cns.nft_coin_name))"
                  ><i class="mdi mdi-content-copy"></i
                ></a>
              </td>
              <td>{{ new Date(cns.create_time * 1000).toISOString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getRecent, getWealthiest, RecentMinted, WealthyUser } from "@/service/ranking";
import { copy } from "@/service/utility";
import { bech32m } from "@scure/base";
import { Vue } from "vue-class-component";

export default class Ranking extends Vue {
  public topHolders: WealthyUser[] = [];
  public lastMinted: RecentMinted[] = [];

  mounted(): void {
    getWealthiest().then((res) => (this.topHolders = res));
    getRecent().then((res) => (this.lastMinted = res));
  }

  getAddressFromPuzzleHash(hash: string): string {
    return bech32m.encode("xch", bech32m.toWords(this.fromHexString(hash)));
  }

  fromHexString(hexString: string): Uint8Array {
    if (!hexString) return new Uint8Array();
    const match = hexString.match(/.{1,2}/g);
    if (!match) return new Uint8Array();
    return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
  }

  shorten(address: string, ellipsis = "...", offset = 0, head = 7, tail = 4): string {
    if (!address) return "";
    if (address.length <= offset + head + tail + ellipsis.length) return address;
    return address.slice(offset, head) + ellipsis + address.slice(-tail);
  }

  copy(copyText: string): void {
    copy(copyText);
    this.$notify("Copied");
  }
}
</script>
<style scoped lang="scss">
.transparent {
  opacity: 80%;
}
</style>
