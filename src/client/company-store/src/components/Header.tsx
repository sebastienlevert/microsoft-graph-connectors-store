import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { useBoolean } from '@uifabric/react-hooks';
import { CatalogItemPanel } from './CatalogItemPanel';
import { ICatalogItem } from '../models/ICatalogItem';
import { deleteItem } from '../services/CatalogService';
import { itemState } from '../state/itemState';
import { useRecoilState } from 'recoil';
import { DeleteItemDialog } from './DeleteItemDialog';

export interface IHeaderProps {
  item?: ICatalogItem;
}

export const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {
  const [panelIsOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [deleteDialogIsOpen, { setTrue: openDeleteDialog, setFalse: dismissDeleteDialog }] = useBoolean(false);
  const [isNew, setIsNew] = React.useState<boolean>(false);
  const [item, setItem] = useRecoilState(itemState);
  const [commandBarItems, setCommandBarItems] = React.useState<ICommandBarItemProps[]>([]);

  React.useEffect(() => {
    setCommandBarItems([
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
        disabled: props.item ? false : true,
        onClick: () => {
          setIsNew(false);
          openPanel();
        },
      },
      {
        key: 'deleteItem',
        text: 'Delete',
        iconProps: { iconName: 'Delete' },
        disabled: props.item ? false : true,
        onClick: openDeleteDialog,
      },
    ]);
  }, [item]);

  const _farItems: ICommandBarItemProps[] = [
    {
      key: 'info',
      text: 'Info',
      ariaLabel: 'Info',
      iconOnly: true,
      iconProps: { iconName: 'Info' },
      onClick: () => console.log('Info'),
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
