import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const CaretDownIconCW = props => (
  <Svg
    width={25}
    height={13}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.789 10.657 6.132 5l1.414-1.414 4.95 4.95 4.95-4.95L18.86 5l-5.657 5.657a1 1 0 0 1-1.414 0Z"
      fill="#000"
      fillOpacity={0.9}
    />
  </Svg>
);

export default CaretDownIconCW;
