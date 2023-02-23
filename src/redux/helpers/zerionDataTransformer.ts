import {
  AssetType,
  ProtocolType,
  TransactionDirection,
  TransactionType,
  ZerionAsset,
  ZerionAssetPrice,
  ZerionTransactionStatus,
} from '@/entities';
import { nativeAssetsPerNetwork } from '@/handlers/assets';
import { Network } from '@/helpers';
import { supportedNativeCurrencies } from '@/references';
import {
  AddressAssetsReceivedMessage,
  PortfolioReceivedMessage,
  TransactionsReceivedMessage,
} from '../data';
import { L2AddressAssetsReceivedMessage } from '../explorer';

// Portfolio
export interface PositionsDistributionByType {
  wallet: number;
  deposited: number;
  borrowed: number;
  locked: number;
  staked: number;
}

export interface PositionsDistributionByChain {
  arbitrum: number;
  aurora: number;
  avalanche: number;
  binance_smart_chain: number;
  ethereum: number;
  fantom: number;
  loopring: number;
  optimism: number;
  polygon: number;
  solana: number;
  xdai: number;
}

export interface Total {
  positions: number;
}

export interface Changes {
  absolute_1d: number;
  percent_1d?: any;
}

export interface PortfolioAttributes {
  positions_distribution_by_type: PositionsDistributionByType;
  positions_distribution_by_chain: PositionsDistributionByChain;
  total: Total;
  changes: Changes;
}

export interface ZerionPortfolioData {
  type: string;
  id: string;
  attributes: PortfolioAttributes;
}

export function toPortfolioReceivedMessage(
  data: ZerionPortfolioData,
  accountAddress: string,
  nativeCurrency: keyof typeof supportedNativeCurrencies,
  network: Network
): PortfolioReceivedMessage {
  let positionsByChain = data.attributes.positions_distribution_by_chain;
  let positionsByType = data.attributes.positions_distribution_by_type;

  return {
    payload: {
      portfolio: {
        arbitrum_assets_value: positionsByChain.arbitrum,
        aurora_assets_value: positionsByChain.aurora,
        avalanche_assets_value: positionsByChain.avalanche,
        ethereum_assets_value: positionsByChain.ethereum,
        fantom_assets_value: positionsByChain.fantom,
        loopring_assets_value: positionsByChain.loopring,
        nft_floor_price_value: 0,
        nft_last_price_value: 0,
        optimism_assets_value: positionsByChain.optimism,
        solana_assets_value: positionsByChain.solana,
        xdai_assets_value: positionsByChain.xdai,
        assets_value: positionsByType.wallet,
        deposited_value: positionsByType.deposited,
        borrowed_value: positionsByType.borrowed,
        locked_value: positionsByType.locked,
        staked_value: positionsByType.staked,
        bsc_assets_value: 0,
        polygon_assets_value: positionsByChain.polygon,
        total_value: data.attributes.total.positions,
        absolute_change_24h: data.attributes.changes.absolute_1d,
        relative_change_24h: data.attributes.changes.percent_1d,
      },
    },
    meta: {
      address: accountAddress,
      currency: nativeCurrency,
      status: 'ok',
      chain_id: network,
    },
  };
}

// Transaction
export interface Links {
  self: string;
  next: string;
}

export interface Icon {
  url: string;
}

export interface Flags {
  verified: boolean;
}

export interface Implementation {
  chain_id: string;
  address: string;
  decimals: number;
}

export interface FungibleInfo {
  name: string;
  symbol: string;
  description: string;
  icon: Icon;
  flags: Flags;
  implementations: Implementation[];
}

export interface Quantity {
  int: string;
  decimals: number;
  float: number;
  numeric: string;
}

export interface Fee {
  fungible_info: FungibleInfo;
  quantity: Quantity;
  price: number;
  value: number;
}

export interface Preview {
  url: string;
  content_type: string;
}

export interface Detail {
  url: string;
  content_type: string;
}

export interface Content {
  preview: Preview;
  detail: Detail;
}

export interface NftInfo {
  contract_address: string;
  token_id: string;
  name: string;
  interface: string;
  content: Content;
}

export interface Transfer {
  fungible_info: FungibleInfo;
  nft_info: NftInfo;
  direction: string;
  quantity: Quantity;
  value: number;
  price: number;
  sender: string;
  recipient: string;
}

export interface Approval {
  fungible_info: FungibleInfo;
  nft_info: NftInfo;
  quantity: Quantity;
  sender: string;
}

export interface TransactionsAttributes {
  operation_type: string;
  hash: string;
  mined_at_block: number;
  mined_at: Date;
  sent_from: string;
  sent_to: string;
  status: string;
  nonce: number;
  fee: Fee;
  transfers: Transfer[];
  approvals: Approval[];
}

export interface Data {
  type: string;
  id: string;
  attributes: TransactionsAttributes;
  relationships: Relationships;
}

export interface Data2 {
  type: string;
  id: string;
}

export interface ZerionTransactionData {
  links: Links;
  data: Data[];
}

export function toTransactionsReceivedMessage(
  data: ZerionTransactionData,
  accountAddress: string,
  nativeCurrency: keyof typeof supportedNativeCurrencies,
  network: Network
): TransactionsReceivedMessage {
  const transactions = data.data.map(dataObj => {
    const attributes = dataObj.attributes;
    const mined_at = Math.round(new Date(attributes.mined_at).getTime() / 1000);
    const changes = attributes.transfers.map(transfer => {
      let icon_url = '';
      if (transfer.fungible_info && transfer.fungible_info.icon) {
        icon_url = transfer.fungible_info.icon.url;
      }
      let relative_change_24h = transfer.quantity.float;
      if (transfer.direction == 'out') {
        relative_change_24h = -relative_change_24h;
      }
      let assetType = dataObj.relationships.chain.data.id;
      if (assetType == 'ethereum') {
        assetType = 'eth';
      }
      let type = assetType as AssetType;
      if (Object.values(AssetType).indexOf(type) < 0) {
        type = AssetType.token;
      }
      return {
        address_from: transfer.sender,
        address_to: transfer.recipient,
        asset: {
          asset_code: dataObj.relationships.chain.data.id,
          name: transfer.fungible_info
            ? transfer.fungible_info.name
            : transfer.nft_info.name,
          symbol: transfer.fungible_info ? transfer.fungible_info.symbol : '',
          decimals: transfer.quantity.decimals,
          type: type,
          icon_url: icon_url,
          price: {
            value: transfer.quantity.float,
            relative_change_24h: relative_change_24h,
            changed_at: mined_at,
          },
        },
        direction: transfer.direction as TransactionDirection,
        price: transfer.price,
        value: +transfer.quantity.int,
      };
    });

    const direction =
      changes.length > 0 ? changes[0].direction : TransactionDirection.self;
    let type = attributes.operation_type as TransactionType;
    if (Object.values(TransactionType).indexOf(type) < 0) {
      type = TransactionType.execution;
    }
    const transaction = {
      address_from: attributes.sent_from,
      address_to: attributes.sent_to,
      block_number: attributes.mined_at_block,
      changes: changes,
      contract: 'contract',
      direction: direction,
      fee: { price: attributes.fee.price, value: attributes.fee.value },
      hash: attributes.hash,
      id: dataObj.id,
      meta: {},
      mined_at: mined_at,
      nonce: attributes.nonce,
      protocol: ProtocolType.rainbow,
      status: attributes.status as ZerionTransactionStatus,
      type: type,
    };

    return transaction;
  });

  return {
    payload: {
      transactions: transactions,
    },
    meta: {
      address: accountAddress,
      currency: nativeCurrency,
      status: 'ok',
      chain_id: network,
    },
  };
}

// Assets
export interface Flags2 {
  displayable: boolean;
}

export interface PositionsAttributes {
  parent?: any;
  protocol: string;
  name: string;
  position_type: string;
  quantity: Quantity;
  value: number;
  price: number;
  changes: Changes;
  fungible_info: FungibleInfo;
  flags: Flags2;
  updated_at?: Date;
  updated_at_block?: number;
}

export interface Links2 {
  related: string;
}

export interface Chain {
  links: Links2;
  data: Data2;
}

export interface Fungible {
  links: Links2;
  data: Data2;
}
export interface Relationships {
  chain: Chain;
  fungible: Fungible;
}

export interface Position {
  type: string;
  id: string;
  attributes: PositionsAttributes;
  relationships: Relationships;
}

export interface ZerionAssetsData {
  links: Links;
  data: Position[];
}

export function toAddressAssetsReceivedMessage(
  data: ZerionAssetsData,
  accountAddress: string,
  nativeCurrency: keyof typeof supportedNativeCurrencies,
  network: Network
): AddressAssetsReceivedMessage {
  const assets: { [id: string]: { asset: ZerionAsset; quantity: string } } = {};
  data.data.map(position => {
    const zerionAsset = positionToZerionAsset(position);

    assets[position.relationships.fungible.data.id] = {
      asset: zerionAsset,
      quantity: position.attributes.quantity.int,
    };
  });

  return {
    payload: {
      assets: assets,
    },
    meta: {
      address: accountAddress,
      currency: nativeCurrency,
      status: 'ok',
      chain_id: network,
    },
  };
}

export function toL2AddressAssetsReceivedMessage(
  data: ZerionAssetsData,
  accountAddress: string,
  nativeCurrency: keyof typeof supportedNativeCurrencies,
  network: Network
): L2AddressAssetsReceivedMessage {
  const assets = data.data.map(position => {
    const zerionAsset = positionToZerionAsset(position);
    const zerionAsseWithL2Fields = {
      ...zerionAsset,
      mainnet_address: nativeAssetsPerNetwork[network],
      network: network,
    };
    return {
      asset: zerionAsseWithL2Fields,
      quantity: position.attributes.quantity.int,
    };
  });

  return {
    payload: {
      assets: assets,
    },
    meta: {
      address: accountAddress,
      currency: nativeCurrency,
      status: 'ok',
      chain_id: network,
    },
  };
}

function positionToZerionAsset(position: Position): ZerionAsset {
  const attributes = position.attributes;
  let icon_url = '';
  if (attributes.fungible_info && attributes.fungible_info.icon) {
    icon_url = attributes.fungible_info.icon.url;
  }

  let changedDate = new Date();
  if (attributes.updated_at) {
    changedDate = attributes.updated_at;
  }
  let assetType = position.relationships.chain.data.id;
  if (assetType == 'ethereum') {
    assetType = 'eth';
  }
  let type = assetType as AssetType;
  if (Object.values(AssetType).indexOf(type) < 0) {
    type = AssetType.token;
  }
  return {
    asset_code: position.relationships.fungible.data.id,
    name: attributes.fungible_info.name,
    symbol: attributes.fungible_info.symbol,
    decimals: attributes.quantity.decimals,
    type: type,
    icon_url: icon_url,
    price: {
      value: attributes.price,
      relative_change_24h: attributes.changes.percent_1d,
      changed_at: Math.round(new Date(changedDate).getTime() / 1000),
    },
  };
}
