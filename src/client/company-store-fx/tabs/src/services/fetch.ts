async function http<T>(path: string, config: RequestInit): Promise<T> {
  const request = new Request(path, config);
  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  // may error if there is no body, return empty array
  return response.json().catch(() => ({}));
}

export async function httpGet<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: 'get', ...config };
  return await http<T>(path, init);
}

export async function httpPost<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = { method: 'post', body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
}

export async function httpPut<T, U>(path: string, body: T, config?: RequestInit): Promise<U> {
  const init = { method: 'put', body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
}

export async function httpDelete(path: string, body: any, config?: RequestInit): Promise<void> {
  const init = { method: 'delete', body: JSON.stringify(body), ...config };
  return await http<any>(path, init);
}
