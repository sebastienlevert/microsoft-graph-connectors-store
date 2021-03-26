import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { useBoolean } from '@uifabric/react-hooks';
import { CatalogItemPanel } from './CatalogItemPanel';
import { ICatalogItem } from '../models/ICatalogItem';
import { itemState } from '../state/itemState';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { DeleteItemDialog } from './DeleteItemDialog';
import { SearchBox } from '@fluentui/react';
import { queryState } from '../state/queryState';
import { Login } from '@microsoft/mgt-react';
import { SimpleLogin } from './SimpleLogin';
import { useIsSignedIn } from '../hooks/useIsSignedIn';
import { TodoItemDialog } from './TodoItemDialog';

export interface IHeaderProps {
  item?: ICatalogItem;
}

export const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {
  const [panelIsOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [deleteDialogIsOpen, { setTrue: openDeleteDialog, setFalse: dismissDeleteDialog }] = useBoolean(false);
  const [todoDialogIsOpen, { setTrue: openTodoDialog, setFalse: dismissTodoDialog }] = useBoolean(false);
  const [item, setItem] = useRecoilState(itemState);
  const [isSignedIn] = useIsSignedIn();
  const setQuery = useSetRecoilState(queryState);

  const commandBarItems = React.useMemo(
    (): ICommandBarItemProps[] => [
      {
        key: 'newItem',
        text: 'New',
        iconProps: { iconName: 'Add' },
        onClick: () => {
          setItem(undefined);
          openPanel();
        },
      },
      {
        key: 'editItem',
        text: 'Edit',
        iconProps: { iconName: 'Edit' },
        disabled: item ? false : true,
        onClick: () => {
          setItem(item);
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
      {
        key: 'addTodoItem',
        text: 'Send to To Do',
        iconProps: { iconName: 'ToDoLogoOutline' },
        disabled: item && isSignedIn ? false : true,
        onClick: openTodoDialog,
      },
    ],
    [item, openPanel, openDeleteDialog, setItem, isSignedIn, openTodoDialog]
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
              marginTop: '5px',
            },
          }}
          disabled={!isSignedIn}
          underlined={true}
          onSearch={setQuery}
          onClear={() => setQuery('')}
        />
      ),
    },
    {
      key: 'login',
      onRender: () => (
        <Login>
          <SimpleLogin template="signed-in-button-content" />
        </Login>
      ),
    },
  ];

  return (
    <div>
      <CommandBar
        items={commandBarItems}
        farItems={_farItems}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
      {panelIsOpen && <CatalogItemPanel onDismiss={dismissPanel} />}
      {deleteDialogIsOpen && <DeleteItemDialog item={item} onDismiss={dismissDeleteDialog} />}
      {todoDialogIsOpen && <TodoItemDialog onDismiss={dismissTodoDialog} />}
    </div>
  );
};
