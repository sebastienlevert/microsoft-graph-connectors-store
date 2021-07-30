import React from 'react';
// https://fluentsite.z22.web.core.windows.net/quick-start
import { Provider, teamsTheme, Loader } from '@fluentui/react-northstar';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';
import { useTeamsFx } from './../hooks/useTeamsFx';
import Privacy from './Privacy';
import TermsOfUse from './TermsOfUse';
import Tab from './Tab';
import './App.css';

import { initializeIcons } from '@uifabric/icons';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { catalogItemsState, getCatalogItems } from './../state/catalogItemsState';
import { externalItemsState, getExternalItemsTest } from './../state/externalItemsState';
import { TeamsProvider } from '@microsoft/mgt-teams-provider';
import { Providers } from '@microsoft/mgt-element';
import * as microsoftTeams from '@microsoft/teams-js';
import { TeamsFxProvider } from '../providers/TeamsFxProvider';
import { loadConfiguration } from '@microsoft/teamsfx';

TeamsProvider.microsoftTeamsLib = microsoftTeams;
Providers.globalProvider = new TeamsFxProvider({
  clientId: process.env.REACT_APP_CLIENT_ID!,
  initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL!,
  simpleAuthEndpoint: process.env.REACT_APP_TEAMSFX_ENDPOINT!,
  scopes: [
    'User.Read',
    'User.ReadBasic.All',
    'User.Read.All',
    'People.Read',
    'ExternalItem.Read.All',
    'Group.Read.All',
    'Tasks.ReadWrite',
  ],
});

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export const App: React.FunctionComponent = () => {
  const { theme } = useTeamsFx();
  const catalogItems = useRecoilValue(getCatalogItems);
  const externalItems = useRecoilValue(getExternalItemsTest);
  const setItems = useSetRecoilState(catalogItemsState);
  const setExternalItems = useSetRecoilState(externalItemsState);

  React.useEffect(() => {
    initializeIcons();
    setItems(catalogItems);
    setExternalItems(externalItems);
  });

  return (
    <Provider theme={theme || teamsTheme} styles={{ backgroundColor: '#eeeeee' }}>
      <Router>
        <Route exact path="/">
          <Redirect to="/tab" />
        </Route>
        <>
          <Route exact path="/privacy" component={Privacy} />
          <Route exact path="/termsofuse" component={TermsOfUse} />
          <Route exact path="/tab" component={Tab} />
        </>
      </Router>
    </Provider>
  );
};
