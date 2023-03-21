<template>
  <div>
    <div class="is-size-3 has-text-centered has-text-white mb-4 pb-4 has-text-weight-semibold">Ranking List</div>
    <div class="overflow-x-auto max-w-6xl margin-auto">
      <div class="is-inline-block is-min-full overflow-hidden">
        <table class="table is-fullwidth is-hoverable is-striped">
          <thead>
            <tr>
              <th colspan="4"><p class="is-size-5">Top Holders in the CNS Community</p></th>
            </tr>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th class="is-hidden-mobile">Binding Address</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(holder, index) in currentHolders"
              :key="index"
              class="is-clickable"
              @click="holder.showAllNames = !holder.showAllNames"
            >
              <td>{{ 10 * (currentTopHolderPage - 1) + index + 1 }}</td>
              <td>
                <div v-if="holder.names.split(',').length > 1">
                  <p class="mb-1" v-for="name in holder.names.split(',').slice(0, 1)" :key="name">
                    <a :href="`https://${name.toLocaleLowerCase()}.cool`" target="_blank" class="has-text-color-cns">
                      {{ name }}</a
                    >
                    <i
                      class="is-pulled-right mdi mdi-chevron-down is-clickable"
                      aria-hidden="true"
                      @click.stop="holder.showAllNames = !holder.showAllNames"
                    ></i>
                  </p>
                  <div v-if="holder.showAllNames">
                    <p class="mb-1" v-for="name in holder.names.split(',').slice(1)" :key="name">
                      <a :href="`https://${name.toLocaleLowerCase()}.cool`" target="_blank" class="has-text-color-cns">
                        {{ name }}</a
                      >
                    </p>
                  </div>
                </div>
                <div v-else>
                  <p class="mb-1">
                    <a :href="`https://${holder.names.toLocaleLowerCase()}.cool`" target="_blank" class="has-text-color-cns">
                      {{ holder.names }}
                    </a>
                  </p>
                </div>
              </td>
              <td class="is-hidden-mobile">
                <span :data-tooltip="getAddressFromPuzzleHash(holder.puzzle_hash)" class="mr-2">{{
                  shorten(getAddressFromPuzzleHash(holder.puzzle_hash))
                }}</span>
                <a href="javascript:void(0)" @click.stop="copy(getAddressFromPuzzleHash(holder.puzzle_hash))"
                  ><i class="mdi mdi-content-copy"></i
                ></a>
              </td>
              <td>{{ (Number(holder.balance) / 1000000000000).toFixed(2) }} XCH</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4">
                <div class="has-background-white">
                  <nav class="pagination is-centered my-2" role="navigation" aria-label="pagination">
                    <a
                      :class="{ 'pagination-previous': true, 'is-disabled': currentTopHolderPage == 1 }"
                      title="This is the first page"
                      @click="currentTopHolderPage = 1"
                      >First</a
                    >
                    <a
                      :class="{ 'pagination-next': true, 'is-disabled': currentTopHolderPage == totalPage }"
                      title="This is the first page"
                      @click="currentTopHolderPage = totalPage"
                      >Last</a
                    >
                    <ul class="pagination-list">
                      <li>
                        <a
                          :class="{ 'pagination-link': true, 'is-disabled': currentTopHolderPage == 1 }"
                          title="This is the first page"
                          @click="
                            () => {
                              if (currentTopHolderPage > 1) currentTopHolderPage -= 1;
                            }
                          "
                        >
                          <i class="mdi mdi-chevron-double-left"></i>
                        </a>
                      </li>
                      <li v-for="page of totalPage" :key="page">
                        <a
                          :class="{ 'pagination-link': true, 'is-cns': currentTopHolderPage == page }"
                          @click="currentTopHolderPage = page"
                          >{{ page }}</a
                        >
                      </li>
                      <li>
                        <a
                          :class="{ 'pagination-link': true, 'is-disabled': currentTopHolderPage == totalPage }"
                          @click="
                            () => {
                              if (currentTopHolderPage < totalPage) currentTopHolderPage += 1;
                            }
                          "
                          ><i class="mdi mdi-chevron-double-right"></i
                        ></a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <!-- <div class="column is-4-widescreen is-12-desktop">
        <table class="table is-fullwidth is-hoverable is-striped">
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
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { getWealthiest, RecentMinted, WealthyUser } from "@/service/ranking";
import { copy, unprefix0x } from "@/service/utility";
import { bech32m } from "@scure/base";
import { Vue } from "vue-class-component";

interface WealthyUserWrapper extends WealthyUser {
  showAllNames: boolean;
}
export default class Ranking extends Vue {
  public topHolders: WealthyUserWrapper[] = [];
  public lastMinted: RecentMinted[] = [];
  public currentTopHolderPage = 1;
  public pageSize = 10;

  get totalPage(): number {
    return this.topHolders.length / this.pageSize;
  }

  get currentHolders(): WealthyUserWrapper[] {
    return this.topHolders.slice((this.currentTopHolderPage - 1) * this.pageSize, this.currentTopHolderPage * this.pageSize);
  }

  mounted(): void {
    getWealthiest().then(
      (res) =>
        (this.topHolders = res.map((r) => ({
          balance: r.balance,
          count: r.count,
          names: r.names,
          puzzle_hash: r.puzzle_hash,
          showAllNames: false,
        })))
    );
    // getRecent().then((res) => (this.lastMinted = res));
  }

  getAddressFromPuzzleHash(hash: string): string {
    return bech32m.encode("xch", bech32m.toWords(this.fromHexString(unprefix0x(hash))));
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
.overflow-hidden {
  overflow: hidden;
}

.overflow-x-auto {
  overflow-x: auto;
}

.is-min-full {
  min-width: 100%;
}

.max-w-6xl {
  max-width: 72rem;
}

.margin-auto {
  margin: auto;
}

tbody {
  font-family: roboto mono, Fira Code, Monaco, Menlo, Source Code Pro, Consolas, courier new, -apple-system, BlinkMacSystemFont,
    Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Roboto,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, monospace;
}
</style>
