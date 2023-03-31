import { useCallback } from 'react';
import { SQIPCardEntry } from 'react-native-square-in-app-payments';
import { IS_IOS } from '@/env';
import { SQUARE_LOCATION_ID } from 'react-native-dotenv';
import { Alert } from '@/components/alerts';
import lang from 'i18n-js';
import useAccountSettings from './useAccountSettings';
import chargeCardNonce from './Charge';

export default function useSquarePay() {
  const { accountAddress, network } = useAccountSettings();

  let numberValue;

  const onPurchaseByCard = async ({ address, value }) => {
    numberValue = Number(value) * 100;
    const cardEntryConfig = {
      collectPostalCode: true,
      squareLocationId: SQUARE_LOCATION_ID,
    };

    if (IS_IOS) {
      await SQIPCardEntry.setIOSCardEntryTheme({
        saveButtonFont: {
          size: 25,
        },
        saveButtonTitle: 'Pay 💳 ',
        keyboardAppearance: 'Light',
        saveButtonTextColor: {
          r: 255,
          g: 0,
          b: 125,
          a: 0.5,
        },
      });
    }

    await SQIPCardEntry.startCardEntryFlow(
      cardEntryConfig,
      onCardNonceRequestSuccess,
      onCardEntryCancel
    );
  };

  const onCardNonceRequestSuccess = async cardDetails => {
    try {
      await chargeCardNonce(cardDetails.nonce, accountAddress, numberValue);
      SQIPCardEntry.completeCardEntry(() => {
        console.log(JSON.stringify(cardDetails));
        var cardData = cardDetails.card;
        Alert({
          buttons: [{ style: 'default', text: lang.t('button.ok') }],
          title: 'Congratulation, Your order was successful',
        });
      });
    } catch (error) {
      SQIPCardEntry.showCardNonceProcessingError(error.message);
    }
  };

  const onCardEntryCancel = () => {
    console.log('onCardEntryCancel');
  };

  return {
    onPurchaseByCard,
  };
}
