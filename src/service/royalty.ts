const isTestnet = window.location.host != process.env.VUE_APP_MAINNET_HOST;

export function getRoyaltyAddress(code: string | null): string {
  if (isTestnet) {
    if (code == "test") {
      return "txch1uvsfhdev6xwgqnfwxpm32cc6r8npvcgfn2850qpsfut40j2ulmhst6h82h";
    } else if (code == "hiya") {
      return "txch1tanqtjx2lymsjuyy4af23p598ksnnwc8gd98zmynfraa088kewlqq62rt2";
    }
  } else {
    if (code == "hiya") {
      return "xch19tq8q0tkm2660mfpjqv9y94j7fcdfpx860a9ymskeulafk9d653qu8wkyk";
    } else if (code == "hezuoshe") {
      return "xch1k3vuxal2s9sl2w3v5dgrckq02tg0uvnswsfmj40j52apkxfagg9q3yrgym";
    } else if (code == "seasonshome") {
      return "xch1p4xeecj35avsjf94y0cysq59swuzgw5544pxym3kmn6qjg67tttqlw0g6a";
    } else if (code == "tanggang") {
      return "xch1f2cwxnrg4lu33xxqqmx74qgzy9e84clxew4cqzczmlu2r96a6g8qjvl6j8";
    } else if (code == "spacescan.io") {
      return "xch1a6cd558gqsz2hch5pt0l8mx7zhavf32q5lyde09zjtqcmkelr9ns59k0j8";
    } else if (code == "ozonewallet") {
      return "xch1hh9phcc8tt703dla70qthlhrxswy88va04zvc7vd8cx2v6a5ywyst8mgul";
    } else if (code == "hemadao") {
      return "xch14t3qkv323ahrx3zfc0qgzyg8ufwt3exmww7ez2krhj2emw0upmmq6ny7nm";
    }
  }

  return process.env.VUE_APP_ROYALTY_ADDRESS ?? "";
}
