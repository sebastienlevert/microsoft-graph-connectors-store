import { ICatalogItem } from '../models/ICatalogItem';

export function getItems(): Promise<ICatalogItem[]> {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/GetAllProducts`).then((response) => response.json());
}

export function getItem(id: string) {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/items/${id}`).then((response) => response.json());
}

export function updateItem(item: ICatalogItem) {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/UpdateProduct/${item.id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'patch',
    body: JSON.stringify(item),
  }).then((response) => response.json());
}

export function createItem(item: ICatalogItem) {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/AddProduct`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify(item),
  }).then((response) => response.json());
}

export function deleteItem(item: ICatalogItem | undefined) {
  if (item) {
    return fetch(`${process.env.REACT_APP_API_BASE_URL}/DeleteProduct`, {
      method: 'delete',
      body: JSON.stringify({
        id: item.id,
      }),
    }).then((response) => response.json());
  }
}
