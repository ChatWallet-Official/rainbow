import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const MoreIconCW = props => (
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
      d="M9.833 16A2.667 2.667 0 1 1 4.5 16a2.667 2.667 0 0 1 5.334 0Zm6.667-2.666a2.667 2.667 0 1 1 0 5.333 2.667 2.667 0 0 1 0-5.334Zm9.333 0a2.667 2.667 0 1 1 0 5.333 2.667 2.667 0 0 1 0-5.334Z"
      fill="#fff"
    />
  </Svg>
);

export default MoreIconCW;
