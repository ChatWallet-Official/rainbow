import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const UmbrellaIcon = props => (
  <Svg
    width={72}
    height={72}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M66 36C66 19.431 52.569 6 36 6 19.431 6 6 19.431 6 36v6h30v15a4.5 4.5 0 1 1-9 0h-4.5a9 9 0 1 0 18 0V42H66v-6Zm-55.5 1.5V36c0-14.083 11.417-25.5 25.5-25.5S61.5 21.917 61.5 36v1.5h-51Zm14.909-11.909 3.182-3.182L33 26.818l10.409-10.409 3.182 3.182-12 12a2.25 2.25 0 0 1-3.182 0l-6-6Z"
      fill="#000"
      fillOpacity={0.9}
      opacity={0.5}
    />
  </Svg>
);

export default UmbrellaIcon;
