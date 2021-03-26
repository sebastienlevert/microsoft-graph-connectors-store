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
export interface ICatalogState {
  columns: IColumn[];
  items: ICatalogItem[];
  isModalSelection?: boolean;
  isCompactMode?: boolean;
  announcedMessage?: string;
}

export interface ICatalogProps {
  onItemInvoked(): void;
}

export const Catalog: React.FunctionComponent<ICatalogProps> = (props: ICatalogProps) => {
  const externalItems = useRecoilValue(getExternalItemsTest);
  const [catalogItems] = useRecoilState(catalogItemsState);
  const [items, setItems] = React.useState<ICatalogItem[]>(catalogItems);
  const setItem = useSetRecoilState(itemState);

  const columns = React.useMemo(
    (): IColumn[] => [
      {
        key: 'columnTitle',
        name: 'Title',
        fieldName: 'title',
        minWidth: 100,
        maxWidth: 250,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: true,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
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
        maxWidth: 50,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        isPadded: true,
      },
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
    ],
    []
  );

  React.useEffect(() => {
    setItems(externalItems);
  }, [externalItems]);

  React.useEffect(() => {
    setItems(catalogItems);
  }, [catalogItems]);

  const selection = new Selection({
    onSelectionChanged: () => {
      setItem(selection.getSelection()[0] as ICatalogItem);
    },
  });

  const _renderItemColumn = (item: ICatalogItem, index: number | undefined, column: IColumn | undefined) => {
    const fieldContent = item[column?.fieldName as keyof ICatalogItem] as string;

    switch (column?.key) {
      case 'columnThumbnailUrl':
        return <Image src={fieldContent} height={70} imageFit={ImageFit.contain} />;

      case 'columnPrice':
        return <span>{fieldContent}</span>;

      default:
        return <span>{fieldContent}</span>;
    }
  };

  const _getKey = (item: any, index?: number): string => {
    return item.key;
  };

  return (
    <Fabric>
      {items && (
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
    </Fabric>
  );
};
