import React from 'react';
import { Header } from '../components/Header';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Catalog } from '../components/Catalog';
import { Loading } from '../components/Loading';
import { itemState } from '../state/itemState';
import { catalogItemsState, getCatalogItems } from '../state/catalogItemsState';

export const CatalogPage: React.FunctionComponent = () => {
  const [currentItem] = useRecoilState(itemState);
  const catalogItems = useRecoilValue(getCatalogItems);
  const setItems = useSetRecoilState(catalogItemsState);

  React.useEffect(() => {
    setItems(catalogItems);
  }, [setItems, catalogItems]);

  return (
    <>
      <Header item={currentItem} />
      <React.Suspense fallback={<Loading />}>
        <Catalog></Catalog>
      </React.Suspense>
    </>
  );
};
