import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ArrowRight = props => (
  <Svg
    width={8}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m5.771 8-4.714 4.714.943.943 5.185-5.185a.667.667 0 0 0 0-.943L2 2.343l-.943.943L5.771 8Z"
      fill="#000"
      fillOpacity={0.55}
    />
  </Svg>
);

export default ArrowRight;
