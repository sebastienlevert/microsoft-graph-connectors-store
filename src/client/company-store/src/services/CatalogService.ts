import { ICatalogItem } from '../models/ICatalogItem';

export function getItems(): Promise<ICatalogItem[]> {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/items`).then((response) => response.json());
}

export function getItem(id: string) {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/items/${id}`).then((response) => response.json());
}

export function updateItem(item: ICatalogItem) {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/items/${item.id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'patch',
    body: JSON.stringify(item),
  }).then((response) => response.json());
}

export function createItem(item: ICatalogItem) {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/items`, {
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
    return fetch(`${process.env.REACT_APP_API_BASE_URL}/items/${item.id}`, {
      method: 'delete',
    }).then((response) => response.json());
  }
}
