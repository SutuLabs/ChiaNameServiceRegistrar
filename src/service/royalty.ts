const isTestnet = window.location.host != process.env.VUE_APP_MAINNET_HOST;

export function getRoyaltyAddress(code: string | null): string {
  if (isTestnet) {
    if (code == "test") {
      return "txch1uvsfhdev6xwgqnfwxpm32cc6r8npvcgfn2850qpsfut40j2ulmhst6h82h";
    }
  } else {
    if (code == "hezuoshe") {
      return "";
    }
  }
  return process.env.VUE_APP_ROYALTY_ADDRESS ?? "";
}
