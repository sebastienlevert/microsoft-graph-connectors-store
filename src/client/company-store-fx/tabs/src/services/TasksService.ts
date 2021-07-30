import { prepScopes, Providers, ProviderState } from '@microsoft/mgt-element';
import { TodoTask, TodoTaskList } from '@microsoft/microsoft-graph-types';
import { ICatalogItem } from '../models/ICatalogItem';

export async function getTaskLists(): Promise<TodoTaskList[]> {
  const provider = Providers.globalProvider;
  let graphClient;
  if (provider && provider.state === ProviderState.SignedIn) {
    graphClient = provider.graph.client;
  }

  const results = await graphClient
    ?.api('/me/todo/lists')
    .version('v1.0')
    .middlewareOptions(prepScopes('Tasks.ReadWrite'))
    .get();

  const taskLists: TodoTaskList[] = results.value;
  return taskLists;
}

export async function addTodoItem(item: ICatalogItem, listId: string | undefined): Promise<TodoTask> {
  const provider = Providers.globalProvider;
  let graphClient;
  if (provider && provider.state === ProviderState.SignedIn) {
    graphClient = provider.graph.client;
  }

  const newTask = await graphClient
    ?.api(`/me/todo/lists/${listId}/tasks`)
    .version('v1.0')
    .middlewareOptions(prepScopes('Tasks.ReadWrite'))
    .post({
      title: item.title,
      linkedResources: [
        {
          webUrl: item.url,
          applicationName: 'Browser',
          displayName: item.title,
        },
      ],
    });

  return newTask as TodoTask;
}
