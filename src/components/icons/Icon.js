import React from 'react';
import { Flex } from '../layout';
import { Emoji } from '../text';

import ApplePayIcon from './svg/ApplePayIcon';
import ArrowBackIcon from './svg/ArrowBack';
import ArrowCircledIcon from './svg/ArrowCircledIcon';
import ArrowIcon from './svg/ArrowIcon';
import ArrowRight from './svg/ArrowRight';
import AvatarIcon from './svg/AvatarIcon';
import BTCIcon from './svg/BTCIcon';
import BackspaceIcon from './svg/BackspaceIcon';
import BuyIconCW from './svg/BuyIconCW';
import CameraIcon from './svg/CameraIcon';
import CaretDownIcon from './svg/CaretDownIcon';
import CaretDownIconCW from './svg/CaretDownIconCW';
import CaretIcon from './svg/CaretIcon';
import CaretLeftIcon from './svg/CaretLeftIcon';
import CaretThinIcon from './svg/CaretThinIcon';
import ChatIconCW from './svg/ChatIconCW';
import CheckmarkCircledIcon from './svg/CheckmarkCircledIcon';
import CheckmarkIcon from './svg/CheckmarkIcon';
import CheckMarkIconCW from './svg/CheckMarkIconCW';
import ClearInputIcon from './svg/ClearInputIcon';
import ClockCW from './svg/ClockCW';
import ClockIcon from './svg/ClockIcon';
import CloseCircledIcon from './svg/CloseCircledIcon';
import CloseIcon from './svg/CloseIcon';
import CloseMarkIconCW from './svg/CloseMarkIconCW';
import CompassIcon from './svg/CompassIcon';
import CopyIcon from './svg/CopyIcon';
import CrosshairIcon from './svg/CrosshairIcon';
import DOGEIcon from './svg/DOGEIcon';
import DiscordIcon from './svg/DiscordIcon';
import DotIcon from './svg/DotIcon';
import DoubleCaretIcon from './svg/DoubleCaretIcon';
import EmojiActivitiesIcon from './svg/EmojiActivitiesIcon';
import EmojiAnimalsIcon from './svg/EmojiAnimalsIcon';
import EmojiFlagsIcon from './svg/EmojiFlagsIcon';
import EmojiFoodIcon from './svg/EmojiFoodIcon';
import EmojiObjectsIcon from './svg/EmojiObjectsIcon';
import EmojiRecentIcon from './svg/EmojiRecentIcon';
import EmojiSmileysIcon from './svg/EmojiSmileysIcon';
import EmojiSymbolsIcon from './svg/EmojiSymbolsIcon';
import EmojiTravelIcon from './svg/EmojiTravelIcon';
import FaceIdIcon from './svg/FaceIdIcon';
import FacebookIcon from './svg/FacebookIcon';
import FatArrowIcon from './svg/FatArrowIcon';
import GearIcon from './svg/GearIcon';
import GitHubIcon from './svg/GitHubIcon';
import HandleIcon from './svg/HandleIcon';
import HiddenIcon from './svg/HiddenIcon';
import InboxIcon from './svg/InboxIcon';
import InfoIcon from './svg/InfoIcon';
import InstagramIcon from './svg/InstagramIcon';
import LTCIcon from './svg/LTCIcon';
import LockIcon from './svg/LockIcon';
import MinusCircledIcon from './svg/MinusCircledIcon';
import MoreIconCW from './svg/MoreIconCW';
import MoreProfileIcon from './svg/MoreProfileIcon';
import NavBack from './svg/NavBack';
import OfflineIcon from './svg/OfflineIcon';
import PasscodeIcon from './svg/PasscodeIcon';
import PinIcon from './svg/PinIcon';
import PlusCircledIcon from './svg/PlusCircledIcon';
import PlusIcon from './svg/PlusIcon';
import ProgressIcon from './svg/ProgressIcon';
import QRCodeIcon from './svg/QRCodeIcon';
import RedditIcon from './svg/RedditIcon';
import ScanCW from './svg/ScanCW';
import ScanHeaderIcon from './svg/ScanHeaderIcon';
import ScannerIcon from './svg/ScannerIcon';
import SearchIcon from './svg/SearchIcon';
import SendIcon from './svg/SendIcon';
import SendIconCW from './svg/SendIconCW';
import SendSmallIcon from './svg/SendSmallIcon';
import SettingsIconCW from './svg/SettingsIconCW';
import ShareIcon from './svg/ShareIcon';
import SignatureIcon from './svg/SignatureIcon';
import SnapchatIcon from './svg/SnapchatIcon';
import SpinnerIcon from './svg/SpinnerIcon';
import StarIcon from './svg/StarIcon';
import SwapIcon from './svg/SwapIcon';
import SwapIconCW from './svg/SwapIconCW';
import TelegramIcon from './svg/TelegramIcon';
import ThreeDotsIcon from './svg/ThreeDotsIcon';
import TickGreenCW from './svg/TickGreenCW';
import TouchIdIcon from './svg/TouchIdIcon';
import TrashIconCW from './svg/TrashIconCW';
import TwitterIcon from './svg/TwitterIcon';
import UmbrellaIcon from './svg/UmbrellaIcon';
import WalletConnectIcon from './svg/WalletConnectIcon';
import WalletSwitcherCaret from './svg/WalletSwitcherCaret';
import WarningCircledIcon from './svg/WarningCircledIcon';
import WarningIcon from './svg/WarningIcon';
import BridgeIcon from './svg/BridgeIcon';

const IconTypes = {
  applePay: ApplePayIcon,
  arrow: ArrowIcon,
  arrowBack: ArrowBackIcon,
  arrowCircled: ArrowCircledIcon,
  arrowRight: ArrowRight,
  avatar: AvatarIcon,
  backspace: BackspaceIcon,
  bridge: BridgeIcon,
  btcCoin: BTCIcon,
  buyCW: BuyIconCW,
  camera: CameraIcon,
  caret: CaretIcon,
  caretDownIcon: CaretDownIcon,
  caretDownIconCW: CaretDownIconCW,
  caretLeftIcon: CaretLeftIcon,
  caretThin: CaretThinIcon,
  chatCW: ChatIconCW,
  checkmark: CheckmarkIcon,
  checkmarkCircled: CheckmarkCircledIcon,
  checkMarkIconCW: CheckMarkIconCW,
  clearInput: ClearInputIcon,
  clock: ClockIcon,
  clockCW: ClockCW,
  close: CloseIcon,
  closeCircled: CloseCircledIcon,
  closeMarkIconCW: CloseMarkIconCW,
  compass: CompassIcon,
  copy: CopyIcon,
  crosshair: CrosshairIcon,
  discord: DiscordIcon,
  dogeCoin: DOGEIcon,
  dot: DotIcon,
  doubleCaret: DoubleCaretIcon,
  emojiActivities: EmojiActivitiesIcon,
  emojiAnimals: EmojiAnimalsIcon,
  emojiFlags: EmojiFlagsIcon,
  emojiFood: EmojiFoodIcon,
  emojiObjects: EmojiObjectsIcon,
  emojiRecent: EmojiRecentIcon,
  emojiSmileys: EmojiSmileysIcon,
  emojiSymbols: EmojiSymbolsIcon,
  emojiTravel: EmojiTravelIcon,
  face: FaceIdIcon,
  facebook: FacebookIcon,
  faceid: FaceIdIcon,
  fatArrow: FatArrowIcon,
  fingerprint: TouchIdIcon,
  gear: GearIcon,
  github: GitHubIcon,
  handle: HandleIcon,
  hidden: HiddenIcon,
  inbox: InboxIcon,
  info: InfoIcon,
  instagram: InstagramIcon,
  lock: LockIcon,
  ltcCoin: LTCIcon,
  navBack: NavBack,
  minusCircled: MinusCircledIcon,
  moreProfile: MoreProfileIcon,
  moreCW: MoreIconCW,
  offline: OfflineIcon,
  passcode: PasscodeIcon,
  pin: PinIcon,
  plus: PlusIcon,
  plusCircled: PlusCircledIcon,
  progress: ProgressIcon,
  qrCode: QRCodeIcon,
  reddit: RedditIcon,
  robot: Emoji,
  scan: ScanHeaderIcon,
  scanCW: ScanCW,
  scanner: ScannerIcon,
  search: SearchIcon,
  send: SendIcon,
  sendCW: SendIconCW,
  sendSmall: SendSmallIcon,
  settingsCW: SettingsIconCW,
  share: ShareIcon,
  signature: SignatureIcon,
  snapchat: SnapchatIcon,
  spinner: SpinnerIcon,
  star: StarIcon,
  sunflower: Emoji,
  swap: SwapIcon,
  swapCW: SwapIconCW,
  telegram: TelegramIcon,
  threeDots: ThreeDotsIcon,
  tickGreenCW: TickGreenCW,
  touchid: TouchIdIcon,
  trashCW: TrashIconCW,
  twitter: TwitterIcon,
  umbrella: UmbrellaIcon,
  walletConnect: WalletConnectIcon,
  walletSwitcherCaret: WalletSwitcherCaret,
  warning: WarningIcon,
  warningCircled: WarningCircledIcon,
};

const Icon = ({ name, testID, ...props }, ref) => {
  const IconElement = IconTypes[name] || Flex;
  const { colors } = useTheme();
  return (
    <IconElement
      {...props}
      colors={colors}
      name={name}
      ref={ref}
      testID={testID}
    />
  );
};

export default React.forwardRef(Icon);
