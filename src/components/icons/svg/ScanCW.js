import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ScanCW = props => (
  <Svg
    width={16}
    height={17}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 10.382v3.37a.67.67 0 0 1-.667.675H10v-1.348h2.667v-2.697H14Zm-12 0h1.333v2.697H6v1.348H2.667A.67.67 0 0 1 2 13.753v-3.371Zm4-8.09V3.64H3.333v2.697H2v-3.37a.67.67 0 0 1 .667-.675H6Zm7.333 0a.67.67 0 0 1 .667.674v3.37h-1.333V3.64H10V2.292h3.333Z"
      fill="#000"
      fillOpacity={0.55}
    />
  </Svg>
);

export default ScanCW;
