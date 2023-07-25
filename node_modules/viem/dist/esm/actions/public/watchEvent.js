import { observe } from '../../utils/observe.js';
import { poll } from '../../utils/poll.js';
import { stringify } from '../../utils/stringify.js';
import { createEventFilter, } from './createEventFilter.js';
import { getBlockNumber } from './getBlockNumber.js';
import { getFilterChanges } from './getFilterChanges.js';
import { getLogs } from './getLogs.js';
import { uninstallFilter } from './uninstallFilter.js';
/**
 * Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms.html#event-log).
 *
 * - Docs: https://viem.sh/docs/actions/public/watchEvent.html
 * - JSON-RPC Methods:
 *   - **RPC Provider supports `eth_newFilter`:**
 *     - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
 *     - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
 *   - **RPC Provider does not support `eth_newFilter`:**
 *     - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.
 *
 * This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent.html#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent.html#onLogs).
 *
 * `watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter.html) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs.html) instead.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchEventParameters}
 * @returns A function that can be invoked to stop watching for new Event Logs. {@link WatchEventReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchEvent } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchEvent(client, {
 *   onLogs: (logs) => console.log(logs),
 * })
 */
export function watchEvent(client, { address, args, batch = true, event, onError, onLogs, pollingInterval = client.pollingInterval, strict: strict_, }) {
    const observerId = stringify([
        'watchEvent',
        address,
        args,
        batch,
        client.uid,
        event,
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
                    filter = (await createEventFilter(client, {
                        address,
                        args,
                        event: event,
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
                            event: event,
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
//# sourceMappingURL=watchEvent.js.map