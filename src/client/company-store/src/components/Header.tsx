import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { useBoolean } from '@uifabric/react-hooks';
import { CatalogItemPanel } from './CatalogItemPanel';
import { ICatalogItem } from '../models/ICatalogItem';
import { deleteItem } from '../services/CatalogService';
import { itemState } from '../state/itemState';
import { useRecoilState } from 'recoil';

export interface IHeaderProps {
  item?: ICatalogItem;
}

export const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {
  const [newItemPanelVisible, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [item] = useRecoilState(itemState);

  const _items: ICommandBarItemProps[] = [
    {
      key: 'newItem',
      text: 'New',
      iconProps: { iconName: 'Add' },
      onClick: openPanel,
    },
    {
      key: 'editItem',
      text: 'Edit',
      iconProps: { iconName: 'Edit' },
      disabled: props.item ? false : true,
      onClick: openPanel,
    },
    {
      key: 'deleteItem',
      text: 'Delete',
      iconProps: { iconName: 'Delete' },
      disabled: props.item ? false : true,
      onClick: () => deleteItem(item),
    },
  ];
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
        items={_items}
        farItems={_farItems}
        ariaLabel="Use left and right arrow keys to navigate between commands"
      />
      {newItemPanelVisible && <CatalogItemPanel onDismiss={dismissPanel} item={item} />}
    </div>
  );
};
