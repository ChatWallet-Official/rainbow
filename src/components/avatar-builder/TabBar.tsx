import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ButtonPressAnimation } from '../animations';
import { Icon } from '../icons';
import { Categories } from './Categories';
import { EmojiCategory } from './types';
import { position } from '@/styles';
import { useTheme } from '@/theme';

interface Props {
  categoryKeys: string[];
  activeCategory: EmojiCategory;
  onPress: (category: EmojiCategory) => void;
}

const TabBar = ({ categoryKeys, activeCategory, onPress }: Props) => {
  const { colors } = useTheme();
  return (
    <>
      {categoryKeys
        .filter(categoryKey => categoryKey !== 'all')
        .map(categoryKey => {
          const category = Categories[categoryKey];
          return (
            <ButtonPressAnimation
              activeOpacity={1}
              duration={100}
              enableHapticFeedback
              key={category.name}
              onPress={() => onPress(category)}
              scaleTo={0.75}
              style={sx.button}
              backgroundColor={
                category === activeCategory
                  ? colors.alpha(colors.white, 0.2)
                  : colors.alpha(colors.white, 0.05)
              }
            >
              {/* {category === activeCategory && (
                <LinearGradient
                  colors={['#FFB114', '#FF54BB', '#00F0FF']}
                  end={{ x: 0, y: 0.5 }}
                  pointerEvents="none"
                  start={{ x: 1, y: 0.5 }}
                  style={[sx.gradient]}
                />
              )} */}
              <Icon
                color={
                  category === activeCategory
                    ? colors.alpha(colors.blueGreyDark, 0.8)
                    : colors.alpha(colors.blueGreyDark, 0.4)
                }
                name={category.icon}
              />
            </ButtonPressAnimation>
          );
        })}
    </>
  );
};

export default TabBar;

const sx = StyleSheet.create({
  button: {
    alignItems: 'center',
    flex: 1,
    height: 30,
    justifyContent: 'center',
    maxWidth: 30,
    borderRadius: 15,
  },
  gradient: {
    borderRadius: 15,
    opacity: 0.1,
    overflow: 'hidden',
    ...position.coverAsObject,
  },
});
