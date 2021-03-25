import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { useBoolean } from '@uifabric/react-hooks';
import { CatalogItemPanel } from './CatalogItemPanel';
import { ICatalogItem } from '../models/ICatalogItem';
import { itemState } from '../state/itemState';
import { useRecoilState } from 'recoil';
import { DeleteItemDialog } from './DeleteItemDialog';
import { SearchBox } from '@fluentui/react';
import { Login } from '@microsoft/mgt-react';

export interface IHeaderProps {
  item?: ICatalogItem;
}

export const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {
  const [panelIsOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [deleteDialogIsOpen, { setTrue: openDeleteDialog, setFalse: dismissDeleteDialog }] = useBoolean(false);
  const [isNew, setIsNew] = React.useState<boolean>(false);
  const [item] = useRecoilState(itemState);

  const commandBarItems = React.useMemo(
    (): ICommandBarItemProps[] => [
      {
        key: 'newItem',
        text: 'New',
        iconProps: { iconName: 'Add' },
        onClick: () => {
          setIsNew(true);
          openPanel();
        },
      },
      {
        key: 'editItem',
        text: 'Edit',
        iconProps: { iconName: 'Edit' },
        disabled: item ? false : true,
        onClick: () => {
          setIsNew(false);
          openPanel();
        },
      },
      {
        key: 'deleteItem',
        text: 'Delete',
        iconProps: { iconName: 'Delete' },
        disabled: item ? false : true,
        onClick: openDeleteDialog,
      },
      {
        key: 'buyItem',
        text: 'Buy',
        iconProps: { iconName: 'ShoppingCart' },
        disabled: item ? false : true,
        onClick: () => {
          window.open(item?.url, '_blank');
        },
      },
    ],
    [item, openPanel, openDeleteDialog, setIsNew]
  );

  const _farItems: ICommandBarItemProps[] = [
    {
      key: 'search',
      onRender: () => (
        <SearchBox
          placeholder="Search"
          className="searchBox"
          styles={{
            root: {
              width: '220px',
            },
          }}
        />
      ),
    },
    {
      key: 'login',
      onRender: () => <Login />,
    },
  ];

  return (
    <div>
      <CommandBar
        items={commandBarItems}
        farItems={_farItems}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
      {panelIsOpen && <CatalogItemPanel onDismiss={dismissPanel} item={item} isNew={isNew} />}
      {deleteDialogIsOpen && <DeleteItemDialog item={item} onDismiss={dismissDeleteDialog} />}
    </div>
  );
};
