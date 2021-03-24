import { atom, selector } from 'recoil';
import { ICatalogItem } from '../models/ICatalogItem';
import { getItems } from '../services/CatalogService';

export const catalogItemsState = atom<ICatalogItem[]>({
  key: 'catalogItemsState',
  default: [],
});

export const getCatalogItems = selector({
  key: 'getCatalogItemsSelector',
  get: async ({ get }) => {
    try {
      return getItems();
    } catch (error) {
      throw error;
    }
  },
});

export const addCatalogItem = selector({
  key: 'addCatalogItemsSelector',
  get: async ({ get }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/GetAllProducts`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
});
