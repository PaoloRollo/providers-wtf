# providers-wtf

[![npm version](https://badge.fury.io/js/providers-wtf.svg)](https://badge.fury.io/js/providers-wtf)

This repo contains the code for the **providers-wtf** npm package. This package is a utility package that allows you to convert easily between **viem** `PublicClient` and `WalletClient` to **ethers** providers (`JsonRpcProvider`, `Web3Provider` and `WebsocketProvider`).

## ❓ Why is this even a package

The reason why I created this package is because there are a lot of web3 SDKs (such as Uniswap, Li.Fi, etc.) that currently do not support **viem** as a signer/provider, and instead they still work using **ethers**.

Since a lot of the frontend libraries have switched to **viem**, this package allows you to easily convert between the two without having to duplicate your code, or to lose your mind to do so.

## 📦 Installation

You can install this package with your favorite package manager:

Using **npm**:

```bash
npm install providers-wtf
```

Using **yarn**:

```bash
yarn add providers-wtf
```

Using **pnpm**:

```bash
pnpm add providers-wtf
```

## 🔨 Compatibility

Currently this package works with the following versions of the **viem** and **ethers** libraries:

- **viem** ^1.4.1
- **ethers** ^5.7.0

Please note that **this package does not support ethers v6 until it will become stable**.

## 📖 Usage

The package exports some useful functions to perform the conversion between the providers, allowing you to have a seamless experience between the two.

These are the currently available methods, with more coming soon:

- [x] `toEthersJsonRpcProvider` - converts a `PublicClient` to a `JsonRpcProvider`
- [x] `toEthersWeb3Provider` - converts a `PublicClient` to a `Web3Provider`
- [x] `toEthersWsProvider` - converts a `PublicClient` to a `WebsocketProvider`
- [x] `toEthersWeb3ProviderWithSigner` - converts a `WalletClient` to a `Web3Provider`
- [x] `toViemPublicClient` - converts a `JsonRpcProvider` to a `PublicClient`
- [x] `toViemWsPublicClient` - converts a `WebsocketProvider` to a `PublicClient`

### `PublicClient` to `JsonRpcProvider`

```ts
import { createPublicClient, http } from 'viem'
import { gnosis } from 'viem/chains'
import { toEthersJsonRpcProvider } from 'providers-wtf'

const publicClient = createPublicClient({
    chain: gnosis,
    transport: http(<YOUR_PROVIDER_URL>)
})

const ethersProvider = toEthersJsonRpcProvider(publicClient)
```

### `PublicClient` to `Web3Provider`

```ts
import { createPublicClient, http } from 'viem'
import { gnosis } from 'viem/chains'
import { toEthersWeb3Provider } from 'providers-wtf'

const publicClient = createPublicClient({
    chain: gnosis,
    transport: http(<YOUR_PROVIDER_URL>)
})

const ethersProvider = toEthersWeb3Provider(publicClient)
```

### `PublicClient` to `WebsocketProvider`

```ts
import { createPublicClient, websocket } from 'viem'
import { gnosis } from 'viem/chains'
import { toEthersWsProvider } from 'providers-wtf'

const publicClient = createPublicClient({
    chain: gnosis,
    transport: websocket(<YOUR_PROVIDER_URL>)
})

const ethersProvider = toEthersWsProvider(publicClient)
```

### `WalletClient` to `Web3Provider`

```ts
import { createWalletClient, custom } from "viem";
import { gnosis } from "viem/chains";
import { toEthersWeb3ProviderWithSigner } from "providers-wtf";

const client = createWalletClient({
  chain: gnosis,
  transport: custom(window.ethereum),
});

const provider = toEthersWeb3ProviderWithSigner(client);
```

### `JsonRpcProvider` to `PublicClient`

```ts
import { providers } from "ethers";
import { toViemPublicClient } from "providers-wtf";

const provider = new providers.JsonRpcProvider(<YOUR_PROVIDER_URL>)
const publicClient = toViemPublicClient(provider)
```

### `WebsocketProvider` to `PublicClient`

```ts
import { providers } from "ethers";
import { toViemWsPublicClient } from "providers-wtf";

const provider = new providers.WebsocketProvider(<YOUR_PROVIDER_URL>)
const publicClient = toViemWsPublicClient(provider)
```

## 🤝 Contributing

Please have a look in the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## 📝 Code of Conduct

Please have a look in the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) file for more information.
