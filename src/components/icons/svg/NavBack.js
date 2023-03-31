import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const NavBack = ({ color, ...props }) => (
  <Svg
    width={12}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m3.343 12 7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414-7.07 7.07Z"
      fill={color || '#fff'}
      fillOpacity={0.9}
    />
  </Svg>
);

export default NavBack;
