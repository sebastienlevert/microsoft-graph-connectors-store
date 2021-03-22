import * as React from 'react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
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
        type={PanelType.medium}
      >
        <TextField label="Title" defaultValue={props.item ? props.item.title : ''} />
        <TextField label="Company" defaultValue={props.item ? props.item.company : ''} />
        <TextField label="Category" defaultValue={props.item ? props.item.category : ''} />
        <TextField label="Price" type="number" defaultValue={props.item ? props.item?.price?.toString() : ''} />
        <TextField label="Description" value={props.item ? props.item.description : ''} multiline rows={10} />
        <TextField label="Thumbnail" defaultValue={props.item ? props.item.thumbnailUrl : ''} />
        <TextField label="Url" defaultValue={props.item ? props.item.url : ''} />
      </Panel>
    </div>
  );
};
