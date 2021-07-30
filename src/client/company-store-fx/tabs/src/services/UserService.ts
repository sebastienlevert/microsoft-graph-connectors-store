import { prepScopes, Providers, ProviderState } from '@microsoft/mgt-element';
import { User } from '@microsoft/microsoft-graph-types';

export async function getMe(): Promise<User> {
  const provider = Providers.globalProvider;
  let graphClient;
  if (provider && provider.state === ProviderState.SignedIn) {
    graphClient = provider.graph.client;
  }

  const result = await graphClient?.api('/me').version('v1.0').middlewareOptions(prepScopes('User.Read')).get();

  const currentUser: User = result;
  return currentUser;
}
