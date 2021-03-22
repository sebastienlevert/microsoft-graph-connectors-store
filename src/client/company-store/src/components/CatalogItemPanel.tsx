import * as React from 'react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { useBoolean } from '@uifabric/react-hooks';
import { ICatalogItem } from '../models/ICatalogItem';
import { IAudienceType } from '../models/IAudienceType';
import { isTemplateTail } from 'typescript';
import { TextField } from '@fluentui/react';

const buttonStyles = { root: { marginRight: 8 } };

export interface INewItemPanelProps {
  onDismiss(): void;
  item?: ICatalogItem;
}

export const CatalogItemPanel: React.FunctionComponent<INewItemPanelProps> = (props: INewItemPanelProps) => {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(true);

  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton onClick={onDismiss} styles={buttonStyles}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={onDismiss}>Cancel</DefaultButton>
      </div>
    ),
    [dismissPanel]
  );

  const onDismiss = React.useCallback(() => {
    dismissPanel();
    props.onDismiss();
  }, [dismissPanel]);

  return (
    <div>
      <Panel
        isOpen={isOpen}
        onDismiss={onDismiss}
        headerText="Edit Catalog Item"
        closeButtonAriaLabel="Close"
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
      >
        <TextField label="Title" value={props.item ? props.item.title : ''} />
        <TextField label="Company" value={props.item ? props.item.company : ''} />
        <TextField label="Category" value={props.item ? props.item.category : ''} />

        <TextField label="Description" value={props.item ? props.item.description : ''} multiline rows={10} />
        {props.item ? <b>{props.item.title}</b> : <b>New Item</b>}
      </Panel>
    </div>
  );
};
