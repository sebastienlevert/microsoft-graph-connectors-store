import { atom, selector } from 'recoil';
import { ICatalogItem } from '../models/ICatalogItem';
import { getExternalItems } from '../services/ExternalItemsService';
import { queryState } from './queryState';

export const externalItemsState = atom<ICatalogItem[]>({
  key: 'externalItemsState',
  default: [],
});

export const getExternalItemsTest = selector({
  key: 'getExternalItemsSelector',
  get: async ({ get }) => {
    try {
      return getExternalItems(get(queryState));
    } catch (error) {
      throw error;
    }
  },
});
