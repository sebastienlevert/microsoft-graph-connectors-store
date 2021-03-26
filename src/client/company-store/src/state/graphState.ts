import { ProviderState } from '@microsoft/mgt-element';
import { atom } from 'recoil';

export const graphState = atom<ProviderState | undefined>({
  key: 'graphState',
  default: ProviderState.SignedOut,
});
