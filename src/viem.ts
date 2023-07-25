import { providers } from "ethers";
import { PublicClient, createPublicClient, http, webSocket } from "viem";

export const toEthersJsonRpcProvider = async (client: PublicClient): Promise<providers.JsonRpcProvider | null> => {
    const { chain } = client
    if (!chain) return null
    // Get the default chain RPC url
    const { default: defaultRPCUrl } = chain.rpcUrls
    if (!defaultRPCUrl.http) throw new Error("public client does not have a json rpc provider")
    return new providers.JsonRpcProvider(defaultRPCUrl.http[0])
}

export const toEthersWsProvider = async (client: PublicClient): Promise<providers.WebSocketProvider | null> => {
    const { chain } = client
    if (!chain) return null
    // Get the default chain RPC url
    const { default: defaultRPCUrl } = chain.rpcUrls
    if (!defaultRPCUrl.webSocket) throw new Error("public client does not have a websocket provider")
    return new providers.WebSocketProvider(defaultRPCUrl.webSocket[0])
}

export const toEthersWeb3Provider = async (client: PublicClient): Promise<providers.Web3Provider | null> => {
    const { transport } = client
    const { request } = transport
    const eip1193Provider = { request }
    return new providers.Web3Provider(eip1193Provider)
}