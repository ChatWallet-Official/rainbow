import { useTheme } from '@/theme';
import { useAccountProfile } from '@/hooks';
import { usePersistentDominantColorFromImage } from '@/hooks/usePersistentDominantColorFromImage';

export function useAccountAccentColor() {
  const { accountColor, accountImage, accountSymbol } = useAccountProfile();

  const dominantColor = usePersistentDominantColorFromImage(accountImage);

  const { colors } = useTheme();
  let accentColor = colors.greenCW;

  const hasLoaded = accountImage || accountSymbol;

  return {
    accentColor,
    loaded: true,
  };
}
