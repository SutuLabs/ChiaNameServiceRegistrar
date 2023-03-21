const baseUrl = "https://walletapi.chiabee.net/Name/"


interface RecentMintedResponse {
    names: RecentMinted[]
}

export interface RecentMinted {
    nft_coin_name: string;
    create_time: number;
    name: string;
}

interface WealthiestResponse {
    names: WealthyUser[]
}

export interface WealthyUser {
    balance: bigint;
    puzzle_hash: string;
    count: number;
    names: string;
}

export async function getRecent(): Promise<RecentMinted[]> {
    try {
        const resp = await fetch(baseUrl + "recent", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });
        const qresp = (await resp.json()) as RecentMintedResponse;
        return qresp.names;
    } catch (error) {
        console.warn(error);
        return [];
    }
}

export async function getWealthiest(): Promise<WealthyUser[]> {
    try {
        const resp = await fetch(baseUrl + "wealthiest", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                count: 50
            })
        });
        const qresp = (await resp.json()) as WealthiestResponse;
        return qresp.names.sort((a, b) => Number(b.balance - a.balance));
    } catch (error) {
        console.warn(error);
        return [];
    }
}