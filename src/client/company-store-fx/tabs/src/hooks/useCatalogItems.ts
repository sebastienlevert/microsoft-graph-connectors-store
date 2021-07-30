import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getItems } from '../services/CatalogService';
import { catalogItemsState } from '../state/catalogItemsState';

export default function useCatalogItems() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useRecoilState(catalogItemsState);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setItems(await getItems());
      setLoading(false);
    }

    fetchData();
  }, [loading]);

  return {
    loading,
    items,
  };
}
