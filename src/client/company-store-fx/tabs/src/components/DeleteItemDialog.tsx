import * as React from 'react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { useBoolean } from '@uifabric/react-hooks';
import { ICatalogItem } from '../models/ICatalogItem';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react';
import { deleteItem } from '../services/CatalogService';
import { catalogItemsState } from '../state/catalogItemsState';
import { useRecoilState } from 'recoil';

export interface IDeleteItemDialogProps {
  item?: ICatalogItem;
  onDismiss(): void;
}

export const DeleteItemDialog: React.FunctionComponent<IDeleteItemDialogProps> = (props: IDeleteItemDialogProps) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);
  const [catalogItems, setCatalogItems] = useRecoilState(catalogItemsState);

  const onDelete = async function () {
    await deleteItem(props.item);
    let tempCatalogItems = [...catalogItems];
    const catalogItemIndex = tempCatalogItems.findIndex((item) => item.id === props.item?.id);
    tempCatalogItems.splice(catalogItemIndex, 1);
    setCatalogItems(tempCatalogItems);

    onDismiss();
  };

  const onDismiss = function () {
    toggleHideDialog();
    props.onDismiss();
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: `Delete ${props.item?.title}?`,
    closeButtonAriaLabel: 'Close',
    subText: `Are you sure you want to delete ${props.item?.title}?`,
  };

  return (
    <>
      <Dialog hidden={hideDialog} onDismiss={toggleHideDialog} dialogContentProps={dialogContentProps}>
        <DialogFooter>
          <PrimaryButton onClick={onDelete} text="Delete" />
          <DefaultButton onClick={onDismiss} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </>
  );
};
