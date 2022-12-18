import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const BuyIconCW = props => (
  <Svg
    width={33}
    height={32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.167 8H5.833v4H3.167V6.333a1 1 0 0 1 1-1h7V8Zm10.666 0h5.334v4h2.666V6.333a1 1 0 0 0-1-1h-7V8Zm-16 16h5.334v2.667h-7a1 1 0 0 1-1-1V20h2.666v4Zm16 0h5.334v-4h2.666v5.667a1 1 0 0 1-1 1h-7V24Zm.324-13.104 1.886 1.885-7.543 7.543-1.178 1.178a1 1 0 0 1-1.415 0l-1.178-1.178-3.771-3.772 1.885-1.885 3.771 3.771 7.543-7.542Z"
      fill="#fff"
    />
  </Svg>
);

export default BuyIconCW;
