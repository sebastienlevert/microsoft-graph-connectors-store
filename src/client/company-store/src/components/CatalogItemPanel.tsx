import * as React from 'react';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { useBoolean } from '@uifabric/react-hooks';
import { ICatalogItem } from '../models/ICatalogItem';
import { Label, TextField } from '@fluentui/react';
import { createItem, updateItem } from '../services/CatalogService';
import { catalogItemsState } from '../state/catalogItemsState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getCatalogItem } from '../state/itemState';
import { Loading } from './Loading';
import { PeoplePicker, PersonType } from '@microsoft/mgt-react';
import { IAudienceItem } from '../models/IAudienceItem';
import { IAudienceType } from '../models/IAudienceType';
import { hasValue } from '../helpers/StringHelpers';

const buttonStyles = { root: { marginRight: 8 } };

export interface INewItemPanelProps {
  onDismiss(): void;
  isNew: boolean;
}

export const CatalogItemPanel: React.FunctionComponent<INewItemPanelProps> = (props: INewItemPanelProps) => {
  const [isOpen, { setFalse: dismissPanel }] = useBoolean(true);
  const [catalogItems, setCatalogItems] = useRecoilState(catalogItemsState);
  //const [item, setItem] = useRecoilState(itemState);
  const item = useRecoilValue(getCatalogItem);
  const [isValid, setIsValid] = React.useState<boolean>(false);

  //const initialState: ICatalogItem = props.isNew ? ({} as ICatalogItem) : props.item!;
  const [data, setData] = React.useState<ICatalogItem>({} as ICatalogItem);

  const handleInputChange = (event: any) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  React.useEffect(() => {
    setIsValid(
      hasValue(data.category) &&
        hasValue(data.company) &&
        hasValue(data.description) &&
        hasValue(data.price) &&
        hasValue(data.thumbnailUrl) &&
        hasValue(data.title) &&
        hasValue(data.url)
    );
  }, [data]);

  React.useState(() => {
    if (!props.isNew) {
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
      if (!props.isNew) {
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
        <PrimaryButton onClick={() => onSave(data)} styles={buttonStyles} disabled={!isValid}>
          {props.isNew ? 'Save' : 'Create'}
        </PrimaryButton>
        <DefaultButton onClick={onDismiss}>Cancel</DefaultButton>
      </div>
    ),
    [data, onDismiss, onSave, item, isValid]
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
          <Label htmlFor={'peoplePicker'}>Audience</Label>
          <PeoplePicker
            id={'peoplePicker'}
            type={PersonType.person}
            defaultSelectedUserIds={data.audience?.map((user) => {
              return user ? user.id : '';
            })}
            selectionChanged={(event: any) => {
              setData({
                ...data,
                audience: event.detail.map((selected: any) => {
                  const people: IAudienceItem = {
                    id: selected.id,
                    type: selected.groupTypes ? IAudienceType.Group : IAudienceType.User,
                  };

                  return people;
                }),
              });
              console.log(event);
            }}
          ></PeoplePicker>
        </Panel>
      </React.Suspense>
    </div>
  );
};
