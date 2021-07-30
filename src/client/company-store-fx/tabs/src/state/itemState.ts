import { atom, selector } from 'recoil';
import { ICatalogItem } from '../models/ICatalogItem';
import { getItem } from '../services/CatalogService';

export const itemState = atom<ICatalogItem | undefined>({
  key: 'itemState',
  default: undefined,
});

export const getCatalogItem = selector({
  key: 'getCatalogItemSelector',
  get: async ({ get }) => {
    try {
      const catalogItem = await getItem(get(itemState)?.id!);
      return catalogItem[0];
    } catch (error) {
      throw error;
    }
  },
});
