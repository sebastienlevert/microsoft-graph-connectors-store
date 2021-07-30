import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Loading } from './../components/Loading';

import { SearchResults } from '../components/SearchResults';
import { SearchBox } from '@fluentui/react';
import { queryState } from '../state/queryState';
import { externalItemsState, getExternalItemsTest } from '../state/externalItemsState';

export const SearchPage: React.FunctionComponent = () => {
  const [query, setQuery] = useRecoilState(queryState);
  const externalItems = useRecoilValue(getExternalItemsTest);
  const setExternalItems = useSetRecoilState(externalItemsState);

  React.useEffect(() => {
    setExternalItems(externalItems);
  }, [setExternalItems, externalItems]);

  return (
    <>
      <SearchBox
        placeholder="Search"
        onSearch={(value) => setQuery(value)}
        value={query}
        onClear={() => setQuery('')}
      />
      <React.Suspense fallback={<Loading />}>
        <SearchResults query={query}></SearchResults>
      </React.Suspense>
    </>
  );
};
