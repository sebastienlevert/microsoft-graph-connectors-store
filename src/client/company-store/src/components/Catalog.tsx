import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react/lib/DetailsList';
import { ICatalogItem } from '../models/ICatalogItem';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { itemState } from '../state/itemState';
import { catalogItemsState } from '../state/catalogItemsState';
import { getExternalItemsTest } from '../state/externalItemsState';
import { queryState } from '../state/queryState';
import { People, PersonCardInteraction } from '@microsoft/mgt-react';
import { IAudienceItem } from '../models/IAudienceItem';
import { useIsSignedIn } from '../hooks/useIsSignedIn';
import { Placeholder } from './Placeholder';
export interface ICatalogState {
  columns: IColumn[];
  items: ICatalogItem[];
  isModalSelection?: boolean;
  isCompactMode?: boolean;
  announcedMessage?: string;
}

export interface ICatalogProps {}

export const Catalog: React.FunctionComponent<ICatalogProps> = (props: ICatalogProps) => {
  const externalItems = useRecoilValue(getExternalItemsTest);
  const [catalogItems] = useRecoilState(catalogItemsState);
  const [query] = useRecoilState(queryState);
  const [items, setItems] = React.useState<ICatalogItem[]>(catalogItems);
  const [columns, setColumns] = React.useState<IColumn[]>([]);
  const setItem = useSetRecoilState(itemState);
  const [isSignedIn] = useIsSignedIn();

  React.useEffect(() => {
    setColumns([
      {
        key: 'columnTitle',
        name: 'Title',
        fieldName: 'title',
        minWidth: 100,
        maxWidth: 250,
        isRowHeader: true,
        isResizable: true,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'columnCompany',
        name: 'Company',
        fieldName: 'company',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'columnCategory',
        name: 'Category',
        fieldName: 'category',
        minWidth: 70,
        maxWidth: 100,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'columnPrice',
        name: 'Price',
        fieldName: 'price',
        minWidth: 50,
        maxWidth: 70,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        isPadded: true,
      },
      ...(query === ''
        ? [
            {
              key: 'columnAudience',
              name: 'Audience',
              fieldName: 'audience',
              minWidth: 50,
              maxWidth: 100,
              isResizable: true,
              isCollapsible: true,
              data: 'string',
              isPadded: true,
            },
          ]
        : []),
      {
        key: 'columnDescription',
        name: 'Description',
        fieldName: 'description',
        minWidth: 70,
        isMultiline: true,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'columnThumbnailUrl',
        name: 'Thumbnail',
        fieldName: 'thumbnailUrl',
        minWidth: 100,
        maxWidth: 100,
        isResizable: false,
        isCollapsible: false,
        data: 'string',
        isPadded: true,
      },
    ]);
  }, [query]);

  React.useEffect(() => {
    let sortedItems = [];
    if (query) {
      sortedItems = [...externalItems];
    } else {
      sortedItems = [...catalogItems];
    }
    sortedItems.sort((a, b) => {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });

    setItems(sortedItems);
  }, [externalItems, catalogItems, query]);

  const selection = new Selection({
    onSelectionChanged: () => {
      setItem(selection.getSelection()[0] as ICatalogItem);
    },
  });

  const _renderItemColumn = (item: ICatalogItem, index: number | undefined, column: IColumn | undefined) => {
    switch (column?.key) {
      case 'columnThumbnailUrl':
        const thumbnailContent = item[column?.fieldName as keyof ICatalogItem] as string;
        return <Image src={thumbnailContent} height={70} imageFit={ImageFit.contain} />;

      case 'columnAudience':
        const audiences = item[column?.fieldName as keyof ICatalogItem] as IAudienceItem[];
        return (
          <People
            userIds={audiences?.map((audience) => {
              return audience.id;
            })}
            personCardInteraction={PersonCardInteraction.none}
            showMax={3}
          />
        );

      case 'columnPrice':
        const priceContent = item[column?.fieldName as keyof ICatalogItem] as number;
        const priceValue = priceContent.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        return <span>{priceValue}</span>;

      default:
        const fieldContent = item[column?.fieldName as keyof ICatalogItem] as string;
        return <span>{fieldContent}</span>;
    }
  };

  const _getKey = (item: any, index?: number): string => {
    return item.key;
  };

  return (
    <Fabric>
      {items && isSignedIn && (
        <DetailsList
          items={items}
          columns={columns}
          selectionMode={SelectionMode.single}
          getKey={_getKey}
          onRenderItemColumn={_renderItemColumn}
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          selectionPreservedOnEmptyClick={true}
          selection={selection}
          onItemInvoked={(item: ICatalogItem) => {
            setItem(item);
            window.open(item.url, '_blank');
          }}
          enterModalSelectionOnTouch={true}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="select row"
        />
      )}
      {!isSignedIn && <Placeholder text={'Please sign in'} icon={'SignIn'} />}
      {(!items || items.length === 0) && isSignedIn && <Placeholder text={'No results...'} icon={'ErrorBadge'} />}
    </Fabric>
  );
};
