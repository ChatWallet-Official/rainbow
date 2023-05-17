import React from 'react';
import {
  Circle,
  Defs,
  Path,
  Pattern,
  Rect,
  SvgProps,
  Use,
  Image,
} from 'react-native-svg';
import Svg from '../Svg';

const MintCoinUSDIcon = ({ color, ...props }: SvgProps) => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Path fill="url(#pattern0)" d="M0 0H60V60H0z" />
    <Defs>
      <Pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#image0_984_29762" transform="scale(.01429)" />
      </Pattern>
      <Image
        id="image0_984_29762"
        width={70}
        height={70}
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
);

export default MintCoinUSDIcon;
