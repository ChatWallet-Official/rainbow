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

const MintCoinETHIcon = ({ color, ...props }: SvgProps) => (
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
        <Use xlinkHref="#image0_984_29769" transform="scale(.01429)" />
      </Pattern>
      <Image
        id="image0_984_29769"
        width={70}
        height={70}
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAddSURBVHgB3ZxLTFRXGMf/506lidqGbky76tCkqzYRmtTE+hq6VBJBEZcOuGpCC6amj9iUgaRtbJoAjY2rCi5FKJigWxBfiQuBpK5cMK7auIGkjzRG5vT7n5k7Xoa5wzzuOaC/BBhmmNHzn+/7f9953FFwyNht3YgMGj0PjcrD29BozD0UL/jTtAZWlHxpjUUvhvlnq1js2K8W4AgFi0zO6HrU4VQGaDUiKNSjFjRW4GFWKUyp/3CzrVmlYQkrwly9pRMSFX1yMwGbiED6GS63H1RTiJhIhZm4rZPyihQkDrekJTVTx/aqy4iISITJRcgI3AtSSGQC1SSMeEg8U2cESWBrMeo9RX8tHuShSibv6J7MNsxj64lCkvKGzf92T59ClVQcMabSvIq+jEYvXgQUho5/pM6gQioShqmzWodJeVIjXiCkJ1qIPUVbJalVtjA5P5nB5htstaTFd5rLFacsYV4CUXzKFmdD83Upyj9/r8AyZiwc00Z/uKEw9BQ4EGXmxijGfu2HA4xPjrCIlKCkMJN39aALo33yRxpjl/oxPTaE3x/MwjYc0+uvmg49lFBh2N67Ksljl1JGnOxtJ1HDUtU7cVeHjq+oMLkcHIQDKMjMjecd/MP5WUxfGYYTNPrC/KaoMKvbkKp5iaBM+j5tXncfI8iBEZP63JRmHeuEYQrJekfVrXQl0HD9FApCURwZMUlwElx45/qIUaVNKSp8ww3DlRGT3MrA2vuCv5j1FEdNXNBwwxj9ueIpTrXECyecayPGYbQEDTeMpUcLzoxYZ8RXA+SFGZ/TrXAULcUMNwyHRhwPek1eGBXbXMMNg6KMDLtJqdw6dfY2v+VqeSsss5HhhkExHRlxwp8qGGFkJS4BB5RjuGG4MuKd25Dkz2wqKRyFZWik5Rhuqee7MGIvp4XvMQlY5sev21ArjozYTJq9SW6bwm77Pz02XHUKBXFkxPXcSvYylqOFglyXLjYqXBhxjPvrsmkeh0VqMdwwfvm+EzbRnggjxrsblqjVcMOg0FdsTjIV4p7N5YUoDDcMpmfUkegjK3y7pTrZESYqww3DthGzXMcRMdkONwXb3L81ZcuI41XvXZfC9Bt/OZn4WTPiyIVhtDx8cBOu4BtgI2oiF2bXW3FcnFhCZ88gdr0Zh01aOnpwcXwJ73+QQNSoiTt6CZbWYXyvibpkv9eUMMI3vGttyysdecQwtH0hGD3d50bNuxpF9PA1vvxhEgMXZvKi3J+binz+xBOjFCbSI6I7XquX/+gyLnzXmS/Xfnp1nxupSqAdO+tx8nQffhqdx56D2WUj+srZZJP59/h4lPAYrSdrnY8RMS0dvUaUT9obTIfqv6PNh5Pol3e7+XD5i4VMGwrS0ZUyIvB1z0vjyOXRDw8cNY9HDc8Wq7E5nYzFim861QIH8Lm8o/+KKIwYDiwoiD/A9KPiAcvI6v5mJD9wpiibxutXh8xtPs4otIHykFRcdsgoc5YuctiAnf/q+bSAvvCFeASF8vFPOTz5M21+Z1q0nOzBkRO9JkII04b9SrCTNr4VeJ0oWdVoMgeHpDItw9LUYESWJKevrF12YEp1dPXlB8ZU49xn6dEiOj8bzN9PIehV3M8O0iUV6UiHtfMGK8f3qTeMMOO39YxsyyZgAQ767KmmfET4FEuv/HMK0iYIRaWJ20Iq0rX2farVlGtR5xoswdSgVxSSjYakMehgirD8nu1sKjqtoK8w0mwiWyg8KJU9g8cjqrLrvwyLFEupIIwEM50oSJsg7IkqqWjVIMI0tO1V6fzhRJvp5PNtd3PJgZeC7X9nT3RLpMXw04i3852v1G7r5y7oDduraMaYQrZFISLGSOB2lhMH1Kz8SMMiNFx2sJXCptABS8f2qbzXrp0rOYgadsV7DpS/Gxws6zaRpm7N2NcdgLY52/YJK+GFsOsdcBQt0ru8E7xj3ew6k4HdvQmEl/AgZkpgsV8JUhgtZJ0w9Box4llYhtHQcjK8e+04nXKSQsJosQu/iq7HyKSSUWN90Zbtf7zIYhNLs+1+xaCx7HnFfbWoMGxwXBgx4cJTsIRnu9sUXKBiOGPGWoTQFbzj+9WQrNVYP3dRWMJZmv1ZtU3ELoZKXTv5Sqknx54hpetwSFu+noAl/P7cNfGdQ058RcYz376/9FVvChsweU/HpVJZvyyHJTzqJcoQlsRXPg5LIZ8NhSGuxHFAWaKQsoQhL4E4ZYtCyt4+4QvKCzeriHcVXEBPqUQUUnbEBBm/pYekW+zB1kdL9RmO7UB/W5OqqC+rShiS+xwHXtPkxDErRpq3DDBwQtoOVEHVwhD6zuoqUq4u4ykTRsmsdO9dlaROITUJ47OJnwISRKwEaSkQXbm1pZqIRBifTRLICMIZ8pb7mJRCeCVL7qINW9cnaPNNUka+BqKIkEKsCONjep9VWWDnMXRtflZr1Dr3fcV8ToOS7Z7tuFxppakEq8IUYk6hKxySLdAG+ZXHaOtVVqx4wZ+mkRVjQSLisfjG4jYPC20OP7zrf+J+RdH2oJ0rAAAAAElFTkSuQmCC"
      />
    </Defs>
  </Svg>
);

export default MintCoinETHIcon;
