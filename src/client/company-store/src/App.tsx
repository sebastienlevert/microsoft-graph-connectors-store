import React from 'react';
import './App.css';
import { initializeIcons } from '@uifabric/icons';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { catalogItemsState, getCatalogItems } from './state/catalogItemsState';
import { externalItemsState, getExternalItemsTest } from './state/externalItemsState';
import { AdminPage } from './pages/AdminPage';
import { TeamsProvider } from '@microsoft/mgt-teams-provider';
import { Providers } from '@microsoft/mgt-element';
import * as microsoftTeams from '@microsoft/teams-js';

TeamsProvider.microsoftTeamsLib = microsoftTeams;
Providers.globalProvider = new TeamsProvider({
  clientId: process.env.REACT_APP_CLIENT_ID!,
  authPopupUrl: '/auth.html',
  scopes: ['User.Read', 'User.ReadBasic.All', 'User.Read.All', 'ExternalItem.Read.All'],
});
initializeIcons();

export const App: React.FunctionComponent = () => {
  const catalogItems = useRecoilValue(getCatalogItems);
  const externalItems = useRecoilValue(getExternalItemsTest);
  const setItems = useSetRecoilState(catalogItemsState);
  const setExternalItems = useSetRecoilState(externalItemsState);

  React.useEffect(() => {
    setItems(catalogItems);
    setExternalItems(externalItems);
  });

  return (
    <>
      <AdminPage></AdminPage>
    </>
  );
};
