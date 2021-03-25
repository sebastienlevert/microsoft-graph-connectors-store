import * as React from 'react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { useBoolean } from '@uifabric/react-hooks';
import { ICatalogItem } from '../models/ICatalogItem';
import { TextField } from '@fluentui/react';
import { createItem, updateItem } from '../services/CatalogService';
import { catalogItemsState } from '../state/catalogItemsState';
import { useRecoilState } from 'recoil';

const buttonStyles = { root: { marginRight: 8 } };

export interface INewItemPanelProps {
  onDismiss(): void;
  item?: ICatalogItem;
  isNew?: boolean;
}

export const CatalogItemPanel: React.FunctionComponent<INewItemPanelProps> = (props: INewItemPanelProps) => {
  const [isOpen, { setFalse: dismissPanel }] = useBoolean(true);
  const [catalogItems, setCatalogItems] = useRecoilState(catalogItemsState);

  const initialState: ICatalogItem = props.isNew ? ({} as ICatalogItem) : props.item!;
  const [data, setData] = React.useState<ICatalogItem>(initialState);
  const handleInputChange = (event: any) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const onDismiss = React.useCallback(
    function () {
      props.onDismiss();
      dismissPanel();
    },
    [dismissPanel, props]
  );

  const onSave = React.useCallback(
    async (data: ICatalogItem) => {
      if (props.item) {
        const updatedItem = await updateItem(data);
        const catalogItemIndex = catalogItems.findIndex((item) => item.id === updatedItem.id);
        let tempCatalogItems = [...catalogItems];
        tempCatalogItems[catalogItemIndex] = updatedItem;
        setCatalogItems(tempCatalogItems);
      } else {
        const newItem = await createItem(data);
        setCatalogItems((items) => items.concat(newItem));
      }

      onDismiss();
    },
    [catalogItems, onDismiss, props.item, setCatalogItems]
  );

  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton onClick={() => onSave(data)} styles={buttonStyles}>
          {props.item ? 'Save' : 'Create'}
        </PrimaryButton>
        <DefaultButton onClick={onDismiss}>Cancel</DefaultButton>
      </div>
    ),
    [data, onDismiss, onSave, props.item]
  );

  return (
    <div>
      <Panel
        isOpen={isOpen}
        onDismiss={onDismiss}
        headerText={props.item ? 'Edit the catalog item' : 'Create a new catalog item'}
        closeButtonAriaLabel="Close"
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
        type={PanelType.medium}
      >
        <TextField label="Title" name="title" value={data.title} onChange={handleInputChange} />
        <TextField label="Company" name="company" value={data.company} onChange={handleInputChange} />
        <TextField label="Category" name="category" value={data.category} onChange={handleInputChange} />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={data.price?.toString()}
          onChange={handleInputChange}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={10}
          value={data.description}
          onChange={handleInputChange}
        />
        <TextField label="Thumbnail" name="thumbnailUrl" value={data.thumbnailUrl} onChange={handleInputChange} />
        <TextField label="Url" name="url" value={data.url} onChange={handleInputChange} />
      </Panel>
    </div>
  );
};
