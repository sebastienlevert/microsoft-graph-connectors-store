import * as React from 'react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { useBoolean } from '@uifabric/react-hooks';
import { ICatalogItem } from '../models/ICatalogItem';
import { TextField } from '@fluentui/react';
import { createItem, updateItem } from '../services/CatalogService';
import { catalogItemsState } from '../state/catalogItemsState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getCatalogItem } from '../state/itemState';
import { Loading } from './Loading';

const buttonStyles = { root: { marginRight: 8 } };

export interface INewItemPanelProps {
  onDismiss(): void;
}

export const CatalogItemPanel: React.FunctionComponent<INewItemPanelProps> = (props: INewItemPanelProps) => {
  const [isOpen, { setFalse: dismissPanel }] = useBoolean(true);
  const [catalogItems, setCatalogItems] = useRecoilState(catalogItemsState);
  //const [item, setItem] = useRecoilState(itemState);
  const item = useRecoilValue(getCatalogItem);

  //const initialState: ICatalogItem = props.isNew ? ({} as ICatalogItem) : props.item!;
  const [data, setData] = React.useState<ICatalogItem>({} as ICatalogItem);
  const handleInputChange = (event: any) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  React.useState(() => {
    if (item) {
      setData(item);
    }
  });

  const onDismiss = React.useCallback(
    function () {
      props.onDismiss();
      dismissPanel();
    },
    [dismissPanel, props]
  );

  const onSave = React.useCallback(
    async (data: ICatalogItem) => {
      if (item) {
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
    [catalogItems, onDismiss, item, setCatalogItems]
  );

  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton onClick={() => onSave(data)} styles={buttonStyles}>
          {item ? 'Save' : 'Create'}
        </PrimaryButton>
        <DefaultButton onClick={onDismiss}>Cancel</DefaultButton>
      </div>
    ),
    [data, onDismiss, onSave, item]
  );

  return (
    <div>
      <React.Suspense fallback={<Loading />}>
        <Panel
          isOpen={isOpen}
          onDismiss={onDismiss}
          headerText={item ? 'Edit the catalog item' : 'Create a new catalog item'}
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
      </React.Suspense>
    </div>
  );
};
