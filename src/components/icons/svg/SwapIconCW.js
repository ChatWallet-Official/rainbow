import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SwapIconCW = props => (
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
      d="M4.883 14a.5.5 0 0 1-.301-.9l8.888-6.719a.4.4 0 0 1 .623.439l-1.415 4.513h15.155V14H4.883Zm23.232 4a.5.5 0 0 1 .302.899l-8.888 6.72a.4.4 0 0 1-.623-.44l1.415-4.512H5.167V18h22.948Z"
      fill="#fff"
    />
  </Svg>
);

export default SwapIconCW;
