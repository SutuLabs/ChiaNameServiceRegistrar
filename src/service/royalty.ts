const isTestnet = window.location.host != process.env.VUE_APP_MAINNET_HOST;

export interface RoyaltyEntity {
  code: string;
  name?: string;
  address: string;
}

const mainnetCodes: RoyaltyEntity[] = [
  {
    code: "hiya",
    address: "xch19tq8q0tkm2660mfpjqv9y94j7fcdfpx860a9ymskeulafk9d653qu8wkyk",
  },
  {
    code: "hezuoshe",
    address: "xch1k3vuxal2s9sl2w3v5dgrckq02tg0uvnswsfmj40j52apkxfagg9q3yrgym",
  },
  {
    code: "seasonshome",
    address: "xch1p4xeecj35avsjf94y0cysq59swuzgw5544pxym3kmn6qjg67tttqlw0g6a",
  },
  {
    code: "tanggang",
    address: "xch1f2cwxnrg4lu33xxqqmx74qgzy9e84clxew4cqzczmlu2r96a6g8qjvl6j8",
  },
  {
    code: "spacescan.io",
    address: "xch1a6cd558gqsz2hch5pt0l8mx7zhavf32q5lyde09zjtqcmkelr9ns59k0j8",
  },
  {
    code: "ozonewallet",
    name: "OzoneWallet",
    address: "xch1hh9phcc8tt703dla70qthlhrxswy88va04zvc7vd8cx2v6a5ywyst8mgul",
  },
  {
    code: "hemadao",
    address: "xch14t3qkv323ahrx3zfc0qgzyg8ufwt3exmww7ez2krhj2emw0upmmq6ny7nm",
  },
];
const testnetCodes: RoyaltyEntity[] = [
  {
    code: "hiya",
    address: "txch1tanqtjx2lymsjuyy4af23p598ksnnwc8gd98zmynfraa088kewlqq62rt2",
  },
  {
    code: "test",
    address: "txch1uvsfhdev6xwgqnfwxpm32cc6r8npvcgfn2850qpsfut40j2ulmhst6h82h",
  },
  {
    code: "ultimate",
    name: "Ultimate Test",
    address: "txch1uvsfhdev6xwgqnfwxpm32cc6r8npvcgfn2850qpsfut40j2ulmhst6h82h",
  },
];

export function getRoyaltyAddress(code: string | null): string {
  const ent = getRoyaltyEntity(code);
  if (ent?.address) return ent.address;

  return process.env.VUE_APP_ROYALTY_ADDRESS ?? "";
}

export function getRoyaltyEntity(code: string | null): RoyaltyEntity | undefined {
  if (!code) return undefined;
  let codes = isTestnet ? testnetCodes : mainnetCodes;
  codes = testnetCodes;

  return codes.find((_) => _.code.toLocaleLowerCase() == code.toLocaleLowerCase());
}
