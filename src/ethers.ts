// import { providers } from "ethers";
// import { PublicClient, createPublicClient, http, webSocket } from "viem";

// export const toViemPublicClient = async (
//   provider: providers.JsonRpcProvider
// ): Promise<PublicClient | null> => {
//   const { connection } = provider;
//   const network = await provider.getNetwork();
//   const { name } = network;
//   const chain = await import(`viem/chains/${name}`);
//   return createPublicClient({ chain, transport: http(connection.url) });
// };

// export const toViemWsPublicClient = async (
//   provider: providers.WebSocketProvider
// ): Promise<PublicClient | null> => {
//   const { connection } = provider;
//   const network = await provider.getNetwork();
//   const { name } = network;
//   const chain = await import(`viem/chains/${name}`);
//   return createPublicClient({ chain, transport: webSocket(connection.url) });
// };
