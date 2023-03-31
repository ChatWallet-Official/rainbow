import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const TickGreenCW = props => (
  <Svg
    width={56}
    height={56}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.667 28c0 12.887 10.446 23.333 23.333 23.333 12.887 0 23.333-10.446 23.333-23.333C51.333 15.113 40.887 4.667 28 4.667 15.113 4.667 4.667 15.113 4.667 28Zm33.653-8.073L25.255 32.992 18.8 26.538l-2.468 2.468 8.22 8.225a1 1 0 0 0 1.414 0L40.8 22.407l-2.48-2.48Z"
      fill="#27AE60"
    />
  </Svg>
);

export default TickGreenCW;
