import { Text } from '../text';
import styled from '@/styled-thing';

const BalanceText = styled(Text).attrs(
  ({ color, size, weight, theme: { colors } }) => ({
    align: 'right',
    color: color || colors.dark,
    size: size || 'lmedium',
    weight: weight || 'medium',
  })
)({});

export default BalanceText;
