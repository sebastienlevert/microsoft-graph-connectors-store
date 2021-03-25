import React from 'react';
import { Header } from './../components/Header';
import { CatalogItemPanel } from './../components/CatalogItemPanel';
import { useBoolean } from '@uifabric/react-hooks';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Catalog } from '../components/Catalog';
import { Loading } from './../components/Loading';
import { itemState } from './../state/itemState';
import { catalogItemsState, getCatalogItems } from './../state/catalogItemsState';

export const AdminPage: React.FunctionComponent = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [currentItem] = useRecoilState(itemState);
  const catalogItems = useRecoilValue(getCatalogItems);
  const setItems = useSetRecoilState(catalogItemsState);

  const onDismissPanel = React.useCallback(() => {
    dismissPanel();
  }, [dismissPanel]);

  React.useEffect(() => {
    setItems(catalogItems);
  }, [setItems, catalogItems]);

  return (
    <>
      <Header item={currentItem} />
      <React.Suspense fallback={<Loading />}>
        <Catalog onItemInvoked={openPanel}></Catalog>
      </React.Suspense>
      {isOpen && (
        <div>
          <CatalogItemPanel onDismiss={onDismissPanel} item={currentItem} />
        </div>
      )}
    </>
  );
};
