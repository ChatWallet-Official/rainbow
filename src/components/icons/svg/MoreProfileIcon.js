import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const MoreProfileIcon = props => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.667 8A1.333 1.333 0 1 1 2 8a1.333 1.333 0 0 1 2.667 0ZM8 6.667a1.333 1.333 0 1 1 0 2.666 1.333 1.333 0 0 1 0-2.667Zm4.667 0a1.333 1.333 0 1 1 0 2.666 1.333 1.333 0 0 1 0-2.667Z"
      fill="#fff"
      fillOpacity={0.8}
    />
  </Svg>
);

export default MoreProfileIcon;
