import * as React from 'react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { useBoolean } from '@uifabric/react-hooks';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react';
import { useRecoilValue } from 'recoil';
import { getCatalogItem } from '../state/itemState';

export interface ITodotemDialogProps {
  onDismiss(): void;
}

export const TodoItemDialog: React.FunctionComponent<ITodotemDialogProps> = (props: ITodotemDialogProps) => {
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(false);
  const item = useRecoilValue(getCatalogItem);

  const onAdd = async function () {
    //await deleteItem(props.item);
    onDismiss();
  };

  const onDismiss = function () {
    toggleHideDialog();
    props.onDismiss();
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: `Add ${item?.title} to Todo?`,
    closeButtonAriaLabel: 'Close',
  };

  return (
    <>
      <Dialog hidden={hideDialog} onDismiss={toggleHideDialog} dialogContentProps={dialogContentProps}>
        <DialogFooter>
          <PrimaryButton onClick={onAdd} text="Add" />
          <DefaultButton onClick={onDismiss} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </>
  );
};
