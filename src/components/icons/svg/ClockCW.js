import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ClockCW = props => (
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
      d="M28 51.333c12.887 0 23.333-10.446 23.333-23.333C51.333 15.113 40.887 4.667 28 4.667 15.113 4.667 4.667 15.113 4.667 28c0 12.887 10.446 23.333 23.333 23.333ZM26.25 28V14h3.5v12.552l8.874 8.874-2.474 2.475-9.9-9.9h.002-.002Z"
      fill="#2D9CDB"
    />
  </Svg>
);

export default ClockCW;
