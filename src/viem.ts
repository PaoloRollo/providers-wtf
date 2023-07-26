import { providers } from "ethers";
import { PublicClient, WalletClient } from "viem";

export const toEthersJsonRpcProvider = (
  client: PublicClient
): providers.JsonRpcProvider | null => {
  const { chain } = client;
  if (!chain) return null;
  // Get the default chain RPC url
  const { default: defaultRPCUrl } = chain.rpcUrls;
  if (!defaultRPCUrl.http)
    throw new Error("public client does not have a json rpc provider");
  return new providers.JsonRpcProvider(defaultRPCUrl.http[0]);
};

export const toEthersWsProvider = (
  client: PublicClient
): providers.WebSocketProvider | null => {
  const { chain } = client;
  if (!chain) return null;
  // Get the default chain RPC url
  const { default: defaultRPCUrl } = chain.rpcUrls;
  if (!defaultRPCUrl.webSocket)
    throw new Error("public client does not have a websocket provider");
  return new providers.WebSocketProvider(defaultRPCUrl.webSocket[0]);
};

export const toEthersWeb3Provider = (
  client: PublicClient
): providers.Web3Provider => {
  const { transport } = client;
  const { request } = transport;
  const eip1193Provider = { request };
  return new providers.Web3Provider(eip1193Provider);
};

export const toEthersWeb3ProviderWithSigner = (
  walletClient: WalletClient
): providers.Web3Provider => {
  const { transport } = walletClient;
  const { request } = transport;
  const eip1193Provider = { request };
  return new providers.Web3Provider(eip1193Provider);
};
