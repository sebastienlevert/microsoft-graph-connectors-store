import { ICatalogItem } from '../models/ICatalogItem';
import { httpPost, httpPut, httpDelete } from './fetch';

export function getItems(): Promise<ICatalogItem[]> {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/GetAllProducts`).then((response) => response.json());
}

export function getItem(id: string) {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/items/${id}`).then((response) => response.json());
}

export async function updateItem(item: ICatalogItem): Promise<ICatalogItem> {
  return await httpPut<ICatalogItem, ICatalogItem>(`${process.env.REACT_APP_API_BASE_URL}/UpdateProduct`, item);
}

export async function createItem(item: ICatalogItem): Promise<ICatalogItem> {
  return await httpPost<ICatalogItem, ICatalogItem>(`${process.env.REACT_APP_API_BASE_URL}/AddProduct`, item);
}

export async function deleteItem(item: ICatalogItem | undefined): Promise<void> {
  if (item) {
    return await httpDelete(`${process.env.REACT_APP_API_BASE_URL}/DeleteProduct`, { id: item.id });
  }
}
