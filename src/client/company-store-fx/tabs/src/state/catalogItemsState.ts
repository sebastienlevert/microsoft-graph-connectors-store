import { atom, selector } from 'recoil';
import { ICatalogItem } from '../models/ICatalogItem';
import { getItems } from '../services/CatalogService';

export const catalogItemsState = atom<ICatalogItem[]>({
  key: 'catalogItemsState',
  default: [],
});

export const getCatalogItems = selector({
  key: 'getCatalogItemsSelector',
  get: async () => {
    try {
      return getItems();
    } catch (error) {
      throw error;
    }
  },
});
