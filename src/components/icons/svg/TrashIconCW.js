import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const TrashIconCW = props => (
  <Svg
    width={24}
    height={25}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="m6.774 6.9.812 13.647a.8.8 0 0 0 .798.753h7.232a.8.8 0 0 0 .798-.753L17.226 6.9H6.774Zm11.655 0-.817 13.719a2 2 0 0 1-1.996 1.881H8.384a2 2 0 0 1-1.996-1.881L5.571 6.9H3.5v-.7a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 .5.5v.7h-2.071ZM14 3.5a.5.5 0 0 1 .5.5v.7h-5V4a.5.5 0 0 1 .5-.5h4Zm-4.5 6h1.2l.5 9H10l-.5-9Zm3.8 0h1.2l-.5 9h-1.2l.5-9Z"
      fill="#EB5757"
    />
  </Svg>
);

export default TrashIconCW;
