import { getAbiItem, } from '../../utils/abi/getAbiItem.js';
import { observe } from '../../utils/observe.js';
import { poll } from '../../utils/poll.js';
import { stringify } from '../../utils/stringify.js';
import { createContractEventFilter, } from './createContractEventFilter.js';
import { getBlockNumber } from './getBlockNumber.js';
import { getFilterChanges } from './getFilterChanges.js';
import { getLogs } from './getLogs.js';
import { uninstallFilter } from './uninstallFilter.js';
/**
 * Watches and returns emitted contract event logs.
 *
 * - Docs: https://viem.sh/docs/contract/watchContractEvent.html
 *
 * This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent.html#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent.html#onLogs).
 *
 * `watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter.html) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchContractEventParameters}
 * @returns A function that can be invoked to stop watching for new event logs. {@link WatchContractEventReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchContractEvent } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchContractEvent(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']),
 *   eventName: 'Transfer',
 *   args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' },
 *   onLogs: (logs) => console.log(logs),
 * })
 */
export function watchContractEvent(client, { abi, address, args, batch = true, eventName, onError, onLogs, pollingInterval = client.pollingInterval, strict: strict_, }) {
    const observerId = stringify([
        'watchContractEvent',
        address,
        args,
        batch,
        client.uid,
        eventName,
        pollingInterval,
    ]);
    const strict = strict_ ?? false;
    return observe(observerId, { onLogs, onError }, (emit) => {
        let previousBlockNumber;
        let filter;
        let initialized = false;
        const unwatch = poll(async () => {
            if (!initialized) {
                try {
                    filter = (await createContractEventFilter(client, {
                        abi,
                        address,
                        args,
                        eventName,
                        strict,
                    }));
                }
                catch { }
                initialized = true;
                return;
            }
            try {
                let logs;
                if (filter) {
                    logs = await getFilterChanges(client, { filter });
                }
                else {
                    // If the filter doesn't exist, we will fall back to use `getLogs`.
                    // The fall back exists because some RPC Providers do not support filters.
                    // Fetch the block number to use for `getLogs`.
                    const blockNumber = await getBlockNumber(client);
                    // If the block number has changed, we will need to fetch the logs.
                    // If the block number doesn't exist, we are yet to reach the first poll interval,
                    // so do not emit any logs.
                    if (previousBlockNumber && previousBlockNumber !== blockNumber) {
                        logs = await getLogs(client, {
                            address,
                            args,
                            fromBlock: previousBlockNumber + 1n,
                            toBlock: blockNumber,
                            event: getAbiItem({
                                abi,
                                name: eventName,
                            }),
                        });
                    }
                    else {
                        logs = [];
                    }
                    previousBlockNumber = blockNumber;
                }
                if (logs.length === 0)
                    return;
                if (batch)
                    emit.onLogs(logs);
                else
                    logs.forEach((log) => emit.onLogs([log]));
            }
            catch (err) {
                emit.onError?.(err);
            }
        }, {
            emitOnBegin: true,
            interval: pollingInterval,
        });
        return async () => {
            if (filter)
                await uninstallFilter(client, { filter });
            unwatch();
        };
    });
}
//# sourceMappingURL=watchContractEvent.js.map