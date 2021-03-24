import React from 'react';
import './App.css';
import { Header } from './components/Header';
import { initializeIcons } from '@uifabric/icons';
import { Catalog } from './components/Catalog';
import { ICatalogItem } from './models/ICatalogItem';
import { CatalogItemPanel } from './components/CatalogItemPanel';
import { useBoolean } from '@uifabric/react-hooks';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { CatalogFunc } from './components/CatalogFunc';
import { Loading } from './components/Loading';
import { itemState } from './state/itemState';
import { catalogItemsState, getCatalogItems } from './state/catalogItemsState';
initializeIcons();

export const App: React.FunctionComponent = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel, toggle: togglePanel }] = useBoolean(false);
  const [currentItem, setCurrentItem] = useRecoilState(itemState);
  const catalogItems = useRecoilValue(getCatalogItems);
  const [items, setItems] = useRecoilState(catalogItemsState);
  //const [item, setItem] = useRecoilState(itemState);

  const onDismissPanel = React.useCallback(() => {
    dismissPanel();
  }, [dismissPanel]);

  React.useEffect(() => {
    setItems(catalogItems);
  }, ['']);

  return (
    <>
      <Header item={currentItem} />
      <React.Suspense fallback={<Loading />}>
        <CatalogFunc onItemInvoked={openPanel}></CatalogFunc>
      </React.Suspense>
      {isOpen && (
        <div>
          <CatalogItemPanel onDismiss={onDismissPanel} item={currentItem} />
        </div>
      )}
    </>
  );
};
