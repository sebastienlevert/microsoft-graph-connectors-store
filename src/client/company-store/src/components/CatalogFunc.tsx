import * as React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { Announced } from 'office-ui-fabric-react/lib/Announced';
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { ICatalogItem } from '../models/ICatalogItem';
import { getItems } from '../services/CatalogService';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { itemState } from '../state/itemState';
import { catalogItemsState, getCatalogItems } from '../state/catalogItemsState';

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px',
  },
  fileIconCell: {
    textAlign: 'center',
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%',
        width: '0px',
        visibility: 'hidden',
      },
    },
  },
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  exampleToggle: {
    display: 'inline-block',
    marginBottom: '10px',
    marginRight: '30px',
  },
  selectionDetails: {
    marginBottom: '20px',
  },
});
const controlStyles = {
  root: {
    margin: '0 30px 20px 0',
    maxWidth: '300px',
  },
};

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

export const CatalogFunc: React.FunctionComponent<ICatalogProps> = (props: ICatalogProps) => {
  const [items, setItems] = useRecoilState(catalogItemsState);
  const [item, setItem] = useRecoilState(itemState);
  const [columns, setColumns] = React.useState<IColumn[]>([]);

  React.useEffect(() => {
    setColumns([
      {
        key: 'columnTitle',
        name: 'Title',
        fieldName: 'title',
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: _onColumnClick,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'columnCompany',
        name: 'Company',
        fieldName: 'company',
        minWidth: 70,
        maxWidth: 150,
        isResizable: true,
        onColumnClick: _onColumnClick,
        data: 'string',
        isPadded: true,
      },
      {
        key: 'columnCategory',
        name: 'Category',
        fieldName: 'category',
        minWidth: 70,
        maxWidth: 150,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        onColumnClick: _onColumnClick,
        isPadded: true,
      },
      {
        key: 'columnPrice',
        name: 'Price',
        fieldName: 'price',
        minWidth: 70,
        maxWidth: 70,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        onColumnClick: _onColumnClick,
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
        onColumnClick: _onColumnClick,
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
        onColumnClick: _onColumnClick,
        isPadded: true,
      },
    ]);
  }, [items]);

  const _onColumnClick = React.useCallback(
    (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
      const newColumns: IColumn[] = columns.slice();
      const currColumn: IColumn = newColumns.filter((currCol) => column.key === currCol.key)[0];
      newColumns.forEach((newCol: IColumn) => {
        if (newCol === currColumn) {
          currColumn.isSortedDescending = !currColumn.isSortedDescending;
          currColumn.isSorted = true;
        } else {
          newCol.isSorted = false;
          newCol.isSortedDescending = true;
        }
        newCol.onColumnClick = _onColumnClick;
      });
      const newItems = _copyAndSort<ICatalogItem>(items, currColumn.fieldName!, currColumn.isSortedDescending);
      setItems(newItems);
      setColumns(newColumns);
    },
    [items]
  );

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

  const _copyAndSort = <T,>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] => {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
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
            //this.props.onItemSelected(item);
            //this.props.onItemInvoked();
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
