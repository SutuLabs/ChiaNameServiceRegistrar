const royaltyAddress = process.env.VUE_APP_ROYALTY_ADDRESS ?? "";
const baseUrl =
  window.location.host == process.env.VUE_APP_MAINNET_HOST
    ? process.env.VUE_APP_API_CNS_URL
    : process.env.VUE_APP_API_TESTNET_CNS_URL;

export interface PriceResponse {
  name: string;
  price?: number;
  annualFee?: number;
  registrationFee?: number;
  royaltyPercentage?: number;
  success: boolean;
  reason?: string;
  code?: string;
}

export interface Price {
  name: string;
  price: number;
  royaltyPercentage: number;
  annualFee: number;
  registrationFee: number;
  reason?: string;
  code?: string;
}

export interface RegisterResponse {
  name: string;
  offer?: string;
  image?: string;
  success: boolean;
  reason?: string;
  code?: string;
}

export async function getPrice(name: string): Promise<Price> {
  try {
    const resp = await fetch(
      baseUrl +
        "api/price?" +
        new URLSearchParams({
          name: name,
        }),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const qresp = (await resp.json()) as PriceResponse;
    if (qresp.success)
      return {
        name: qresp.name ?? "",
        price: qresp.price ?? -1,
        annualFee: qresp.annualFee ?? -1,
        registrationFee: qresp.registrationFee ?? -1,
        royaltyPercentage: qresp.royaltyPercentage ?? -1,
      };
    return {
      name: "",
      price: -1,
      annualFee: -1,
      registrationFee: -1,
      royaltyPercentage: -1,
      reason: qresp.reason,
      code: qresp.code,
    };
  } catch (error) {
    console.warn(error);
    return { name: "", price: -1, annualFee: -1, registrationFee: -1, royaltyPercentage: -1 };
  }
}

export async function register(
  name: string,
  address = "",
  publicKey = "",
  did = "",
  text = ""
): Promise<RegisterResponse | null> {
  try {
    const resp = await fetch(baseUrl + "api/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        royaltyAddress: royaltyAddress,
        address: address,
        publicKey: publicKey,
        did: did,
        text: text,
      }),
    });
    const qresp = (await resp.json()) as RegisterResponse;
    return qresp;
  } catch (error) {
    console.warn(error);
    return null;
  }
}
