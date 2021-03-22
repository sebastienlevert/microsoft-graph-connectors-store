import React from 'react';
import './App.css';
import { Header } from './components/Header';
import { initializeIcons } from '@uifabric/icons';
import { Catalog } from './components/Catalog';
import { ICatalogItem } from './models/ICatalogItem';
import { CatalogItemPanel } from './components/CatalogItemPanel';
import { useBoolean } from '@uifabric/react-hooks';
initializeIcons();

export const App: React.FunctionComponent = () => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel, toggle: togglePanel }] = useBoolean(false);
  const [currentItem, setCurrentItem] = React.useState<ICatalogItem>();

  const onDismissPanel = React.useCallback(() => {
    dismissPanel();
  }, [dismissPanel]);
  const onItemSelected = React.useCallback(
    (item: ICatalogItem) => {
      setCurrentItem(item);
    },
    [openPanel]
  );

  return (
    <>
      <Header item={currentItem} />
      <Catalog onItemSelected={onItemSelected} onItemInvoked={openPanel}></Catalog>
      {isOpen && (
        <div>
          <CatalogItemPanel onDismiss={onDismissPanel} item={currentItem} />
        </div>
      )}
    </>
  );
};
