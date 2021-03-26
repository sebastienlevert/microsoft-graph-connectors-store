import { ICatalogItem } from '../models/ICatalogItem';
import { httpPost, httpPut, httpDelete, httpGet } from './fetch';

export async function getItems(title?: string): Promise<ICatalogItem[]> {
  if (title) {
    return await httpPost<{ title: string }, ICatalogItem[]>(
      `${process.env.REACT_APP_API_BASE_URL}/GetProductUsingStartsWith`,
      { title: title }
    );
  } else {
    return await httpGet<ICatalogItem[]>(`${process.env.REACT_APP_API_BASE_URL}/GetAllProducts`);
  }
}

export async function getItem(id: string) {
  return await httpPost<{ id: string }, ICatalogItem[]>(`${process.env.REACT_APP_API_BASE_URL}/GetProductById`, {
    id: id,
  });
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
