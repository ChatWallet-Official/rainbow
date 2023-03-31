import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CheckMarkIconCW = ({ color, ...props }) => (
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
      d="M8.657 18.435 3 12.778l1.414-1.414 4.95 4.95L20.678 5l1.414 1.414-12.02 12.021a1 1 0 0 1-1.415 0Z"
      fill={color || '#fff'}
    />
  </Svg>
);

export default CheckMarkIconCW;
