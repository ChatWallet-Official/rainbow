import React, { useMemo, useRef, useState } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import TouchableBackdrop from '../components/TouchableBackdrop';
import ColorCircle from '../components/avatar-builder/ColorCircle';
import { EmojiSelector } from '../components/avatar-builder/EmojiSelector';
import { HeaderHeightWithStatusBar } from '../components/header';
import { Column, Row } from '../components/layout';
import useUpdateEmoji from '../hooks/useUpdateEmoji';
import { useNavigation } from '../navigation/Navigation';
import { deviceUtils } from '../utils';
import { AVATAR_CIRCLE_TOP_MARGIN } from '@/navigation/effects';
import { useDimensions } from '@/hooks';
import styled from '@/styled-thing';
import { useTheme } from '@/theme';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { colors } from '@/styles';
import { Icon } from '@/components/icons';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { EmojiAvatar } from '@/components/asset-list/RecyclerAssetList2/profile-header/ProfileAvatarRow';

const AvatarCircleHeight = 60;
const AvatarCircleMarginTop = 2;
const AvatarBuilderTopPoint =
  HeaderHeightWithStatusBar + AvatarCircleHeight + AvatarCircleMarginTop;
const StatusBarHeight = getStatusBarHeight(true);

const Container = styled(Column)({
  backgroundColor: ({ currentAccountColor }) => currentAccountColor,
});

const SheetContainer = styled(Column)({
  // backgroundColor: ({ theme: { colors } }) => colors.transparent,
  // borderRadius: 20,
  height: ({ deviceHeight }) =>
    deviceHeight ? Math.floor((deviceHeight / 13) ** 1.5) : 420,
  overflow: 'hidden',
  width: '100%',
});

const ScrollableColorPicker = styled.ScrollView({
  height: 42,
  marginHorizontal: 10,
  overflow: 'hidden',
});

const SelectedColorRing = styled(Animated.View)({
  alignSelf: 'center',
  borderColor: ({ selectedColor }) => selectedColor,
  borderRadius: 20,
  borderWidth: 3,
  height: 38,
  left: 1,
  position: 'absolute',
  width: 38,
});

const springConfig = {
  damping: 38,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
  stiffness: 600,
};

const AvatarBuilder = ({ route: { params } }) => {
  const { height, width } = useDimensions();
  const { colors } = useTheme();
  const selectedRingPosition = useSharedValue(params.initialAccountColor * 40);
  const { goBack } = useNavigation();
  const [currentAccountColor, setCurrentAccountColor] = useState(
    colors.avatarBackgrounds[params.initialAccountColor]
  );
  const [currentEmoji, setCurrentEmoji] = useState(null);
  const colorIndex = useRef(params.initialAccountColor);
  const { saveInfo } = useUpdateEmoji();

  const onChangeEmoji = event => {
    ReactNativeHapticFeedback.trigger('selection');
    setCurrentEmoji(`${event} ${params.initialAccountName}`);
    saveInfo(`${event} ${params.initialAccountName}`, colorIndex.current);
  };

  const selectedRingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: selectedRingPosition.value }],
  }));

  const selectedOffset = useMemo(() => {
    const maxOffset = colors.avatarBackgrounds.length * 40 - width + 20;
    const rawOffset =
      params.initialAccountColor * 40 - width / 2 + width ** 0.5 * 1.5;
    let finalOffset = rawOffset;
    if (rawOffset < 0) {
      finalOffset = 0;
    }
    if (rawOffset > maxOffset) {
      finalOffset = maxOffset;
    }
    return {
      x: finalOffset, // curve to have selected color in middle of scrolling colorpicker
    };
  }, [params.initialAccountColor, width, colors.avatarBackgrounds.length]);

  const onPressClose = () => {
    saveInfo(
      `${params.initialAccountSymbol} ${params.initialAccountName}`,
      params.initialAccountColor
    );
    goBack();
  };

  const onPressDone = () => {
    goBack();
  };

  return (
    <Container
      currentAccountColor={currentAccountColor}
      {...deviceUtils.dimensions}
      testID="avatar-builder"
    >
      <View style={styles.background}></View>
      <Column
        flex={1}
        justify="space-between"
        align="center"
        pointerEvents="box-none"
      >
        <Row width="100%" justify="space-between" marginTop={StatusBarHeight}>
          <TouchableOpacity style={styles.navItem} onPress={onPressClose}>
            <Icon name="closeMarkIconCW" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={onPressDone}>
            <Icon name="checkMarkIconCW" />
          </TouchableOpacity>
        </Row>
        <View style={styles.avatarContainer}>
          <EmojiAvatar size={110} />
          <Row justify="center" paddingTop={32}>
            <ScrollableColorPicker
              contentOffset={selectedOffset}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <SelectedColorRing
                selectedColor={currentAccountColor}
                style={selectedRingStyle}
              />
              {colors.avatarBackgrounds.map((color, index) => (
                <ColorCircle
                  backgroundColor={color}
                  isSelected={index - 4 === 0}
                  key={color}
                  onPressColor={() => {
                    const destination = index * 40;
                    selectedRingPosition.value = withSpring(
                      destination,
                      springConfig
                    );
                    colorIndex.current = colors.avatarBackgrounds.indexOf(
                      color
                    );

                    setCurrentAccountColor(color);
                    saveInfo(currentEmoji, colorIndex.current);
                  }}
                />
              ))}
            </ScrollableColorPicker>
          </Row>
        </View>
        <SheetContainer deviceHeight={height}>
          <EmojiSelector
            columns={7}
            onEmojiSelected={onChangeEmoji}
            showHistory={false}
            showSearchBar={false}
          />
        </SheetContainer>
      </Column>
    </Container>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.black50,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  navItem: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: colors.alpha(colors.white, 0.1),
    borderRadius: 16,
    height: 238,
    marginBottom: 24,
  },
});

export default AvatarBuilder;
