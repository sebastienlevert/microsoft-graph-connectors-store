import { ICatalogItem } from '../models/ICatalogItem';
import { prepScopes, Providers, ProviderState } from '@microsoft/mgt-element';
import { SearchResponse } from '@microsoft/microsoft-graph-types';

export async function getExternalItems(query: string): Promise<any[]> {
  if (query) {
    const provider = Providers.globalProvider;
    let graphClient;
    if (provider && provider.state === ProviderState.SignedIn) {
      graphClient = provider.graph.client;
    }

    const results = await graphClient
      ?.api('/search/query')
      .version('beta')
      .middlewareOptions(prepScopes('ExternalItem.Read.all'))
      .post({
        requests: [
          {
            entityTypes: ['externalItem'],
            contentSources: ['/external/connections/fhlspring21mgcstorebravo'],
            query: {
              queryString: query,
            },
            from: 0,
            size: 25,
            fields: ['id', 'title', 'thumbnailUrl', 'company', 'category', 'description', 'price', 'url'],
          },
        ],
      });

    const searchResponse: SearchResponse[] = results.value;
    return toCatalogItem(searchResponse);
  } else {
    return await Promise.resolve([]);
  }
}

function toCatalogItem(searchResponses: SearchResponse[]) {
  console.log(searchResponses);
  let catalogItems: ICatalogItem[] = [];
  searchResponses.forEach((searchResponse) => {
    searchResponse.hitsContainers?.forEach((container) => {
      container.hits?.forEach((hit) => {
        catalogItems.push({
          id: (hit.resource as any)?.properties?.id,
          title: (hit.resource as any)?.properties?.title,
          thumbnailUrl: (hit.resource as any)?.properties?.thumbnailUrl,
          company: (hit.resource as any)?.properties?.company,
          category: (hit.resource as any)?.properties?.category,
          description: (hit.resource as any)?.properties?.description,
          price: (hit.resource as any)?.properties?.price,
          url: (hit.resource as any)?.properties?.url,
        });
      });
    });
  });

  return catalogItems;
}
