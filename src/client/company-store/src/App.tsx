import React from 'react';
import './App.css';
import { initializeIcons } from '@uifabric/icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { catalogItemsState, getCatalogItems } from './state/catalogItemsState';
import { IPivotStyleProps, IPivotStyles, IStyleFunctionOrObject, Pivot, PivotItem } from '@fluentui/react';
import { AdminPage } from './pages/AdminPage';
import { SearchPage } from './pages/SearchPage';
import { TeamsProvider } from '@microsoft/mgt-teams-provider';
import { Providers } from '@microsoft/mgt-element';
import * as microsoftTeams from '@microsoft/teams-js';
import { Login } from '@microsoft/mgt-react';
import { MsalProvider } from '@microsoft/mgt-msal-provider';

TeamsProvider.microsoftTeamsLib = microsoftTeams;
Providers.globalProvider = new TeamsProvider({
  clientId: process.env.REACT_APP_CLIENT_ID!,
  authPopupUrl: '/auth.html',
  scopes: ['User.Read.All', 'User.Read'],
});
initializeIcons();

export const App: React.FunctionComponent = () => {
  const catalogItems = useRecoilValue(getCatalogItems);
  const [items, setItems] = useRecoilState(catalogItemsState);

  React.useEffect(() => {
    setItems(catalogItems);
  });

  const pivotStyles: IStyleFunctionOrObject<IPivotStyleProps, IPivotStyles> = { itemContainer: { paddingTop: '10px' } };
  return (
    <>
      {/**<Pivot aria-label="Count and Icon Pivot Example" styles={pivotStyles}>
        <PivotItem headerText="Search" itemCount={23} itemIcon="Search">
          <SearchPage />
        </PivotItem>
  <PivotItem headerText="Admin" itemCount={items.length} itemIcon="Settings">*/}
      <AdminPage></AdminPage>
      {/*</PivotItem>
      </Pivot>*/}
    </>
  );
};
