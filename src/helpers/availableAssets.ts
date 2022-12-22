import { buildCoinsList } from './assets';
import networkTypes from './networkTypes';
import lang from 'i18n-js';

export const availableAssets = (
  hiddenCoins: any,
  nativeCurrency: any,
  network: any,
  pinnedCoins: any,
  savings: any,
  sortedAssets: any,
  uniqueTokens: any
) => {
  let data: any[] = [];

  const { assets } = buildCoinsList(
    sortedAssets,
    nativeCurrency,
    false,
    pinnedCoins,
    hiddenCoins
  );

  let smallBalances = [];
  let shitcoins = [];

  if (assets[assets.length - 1]?.smallBalancesContainer) {
    smallBalances = assets.pop();
    shitcoins = smallBalances.assets;
  }

  if (assets[assets.length - 1]?.coinDivider) {
    assets.pop(); // removes not needed coin divider
  }

  const visibleAssetsLength = assets.length;

  data = assets;

  if (smallBalances.assets?.length > 0) {
    data.push(smallBalances);
  }

  if (savings && savings.length > 0 && network === networkTypes.mainnet) {
    data = data.concat([{ data: savings, name: lang.t('savings.label') }]);
  }
  if (uniqueTokens && uniqueTokens.length > 0) {
    data = data.concat(uniqueTokens);
  }

  return data;
};
