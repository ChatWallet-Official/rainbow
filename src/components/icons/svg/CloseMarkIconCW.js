import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CloseMarkIconCW = ({ color, ...props }) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m12 10.586 5.657-5.657 1.414 1.414L13.414 12l5.657 5.657-1.414 1.414L12 13.414l-5.657 5.657-1.414-1.414L10.586 12 4.929 6.343l1.414-1.414L12 10.586Z"
      fill={color || '#fff'}
      fillOpacity={0.9}
    />
  </Svg>
);

export default CloseMarkIconCW;
