import { atom } from 'recoil';
import { ICatalogItem } from '../models/ICatalogItem';

export const itemState = atom<ICatalogItem | undefined>({
  key: 'itemState',
  default: undefined,
});
