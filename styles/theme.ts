import { merge } from 'theme-ui';
import { deep } from '@theme-ui/presets';
import type { Theme } from 'theme-ui';

const theme: Theme = merge(deep, {
  space: {
    padding: '4ch',
  },
  styles: {
    p: {
      width: 'clamp(45ch, 75%, 75ch)',
    },
  },
});

export default theme;