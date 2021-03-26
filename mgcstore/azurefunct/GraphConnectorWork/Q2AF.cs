using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using azurefunct.Helper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.Graph.Auth;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace azurefunct.GraphConnectorWork
{
    public static class Q2AF
    {
        [FunctionName("Q2AF")]
        public static async Task RunAsync([QueueTrigger("mgcstoreproduct", Connection = "AzureWebJobsStorage")]string myQueueItem, ILogger log)
        {
            //log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
            var data = JsonConvert.DeserializeObject<archiveProduct>(myQueueItem);
            /*
            dynamic externalitem = new JObject();
            externalitem.@odatatype = "microsoft.graph.externalItem";
            externalitem.acl = new JArray(
                                    new JObject { { "type", "user" }, { "type", "bac58813-8954-4633-9503-cc51c0ab34c9" }, { "accessType", "grant" }, { "identitySource", "azureActiveDirectory" } },
                                    new JObject { { "type", "user" }, { "type", "81d94c38-9389-4b00-8769-914130bd1909" }, { "accessType", "grant" }, { "identitySource", "azureActiveDirectory" } },
                                    new JObject { { "type", "user" }, { "type", "5e2ff59c-bc04-4bbe-b046-03acd420b71a" }, { "accessType", "grant" }, { "identitySource", "azureActiveDirectory" } },
                                    new JObject { { "type", "group" }, { "type", "f0a3aa8f-0269-4123-950b-d2e87e782af2" }, { "accessType", "grant" }, { "identitySource", "azureActiveDirectory" } },
                                    new JObject { { "type", "group" }, { "type", "e63e0c30-c44c-4a9c-a68e-e57bf830ac2b" }, { "accessType", "grant" }, { "identitySource", "azureActiveDirectory" } },
                                    new JObject { { "type", "group" }, { "type", "7f6c5436-f148-4b53-8117-403e1ad6ec80" }, { "accessType", "grant" }, { "identitySource", "azureActiveDirectory" } }
                                    );
            externalitem.properties = new JArray(
                                     new JObject { { "id", data.Id } },
                                     new JObject { { "title", data.Title } },
                                     new JObject { { "thumbnailUrl", data.ThumbnailUrl } },
                                     new JObject { { "company", data.Company } },
                                     new JObject { { "category", data.Category } },
                                     new JObject { { "description", data.Description } },
                                     new JObject { { "price", data.Price } },
                                     new JObject { { "url", data.Url } }
                                    );
            externalitem.content = new JArray
                                    {
                                        new JObject{{"value",data.Description}},
                                        new JObject{{ "type","text"}}
                                    };

            var sendme = externalitem.ToString();
            log.LogInformation($"JObject to send is: {externalitem.ToString()}");
            */
            var payload = $@"
                {{
                '@odata.type': 'microsoft.graph.externalItem',
                'acl': [
                {{
                    'type': 'user',
                    'value': 'bac58813-8954-4633-9503-cc51c0ab34c9',
                    'accessType': 'grant',
                    'identitySource': 'azureActiveDirectory'
                }},
                {{
                    'type': 'user',
                    'value': '81d94c38-9389-4b00-8769-914130bd1909',
                    'accessType': 'grant',
                    'identitySource': 'azureActiveDirectory'
                }},
                {{
                    'type': 'user',
                    'value': '5e2ff59c-bc04-4bbe-b046-03acd420b71a',
                    'accessType': 'grant',
                    'identitySource': 'azureActiveDirectory'
                }},
                {{
                    'type': 'group',
                    'value': 'f0a3aa8f-0269-4123-950b-d2e87e782af2',
                    'accessType': 'grant',
                    'identitySource': 'azureActiveDirectory'
                }},
                {{
                    'type': 'group',
                    'value': 'e63e0c30-c44c-4a9c-a68e-e57bf830ac2b',
                    'accessType': 'grant',
                    'identitySource': 'azureActiveDirectory'
                }},
                {{
                    'type': 'group',
                    'value': '7f6c5436-f148-4b53-8117-403e1ad6ec80',
                    'accessType': 'grant',
                    'identitySource': 'azureActiveDirectory'
                }}
                ],
                'properties': {{
                'id': '{data.Id}',
                'title@odata.type': 'String',
                'title': '{data.Title}',
                'thumbnailUrl': '{data.ThumbnailUrl}',
                'company': '{data.Company}',
                'category': '{data.Category}',
                'description': '{data.Description}',
                'price': '{data.Price}',
                'url': '{data.Url}'
                }},
                'content': {{
                'value': '{data.Description}',
                'type': 'text'
                }}
                }}";
            //var doctosend = JsonConvert.DeserializeObject<JObject>(payload);
            string currItemId = data.Id.ToString();
            log.LogInformation($"Item Id being sent is: {currItemId}");
            string currConnectionId = "fhlspring21mgcstorebravo";
            log.LogInformation($"Connection ID of the External Conn: {currConnectionId}");

            try
            {
                var message = new HttpRequestMessage
                {
                    Method = HttpMethod.Put,
                    RequestUri = new Uri("https://graph.microsoft.com/beta/external/connections/fhlspring21mgcstorebravo/items/"+data.Id),
                    Content = new StringContent(payload.ToString(), Encoding.UTF8, "application/json"),
                };
                var clientId = "eca17835-d15c-4eaf-b5d8-ae24a0e6ac6e";
                var tenantID = "42cfaa48-a49e-4e95-b6f0-ab7b4b60d8a1";
                var clientSecret = "c27wSKS9GePpf6Gk~Np-4mrbrtLEO5-5~n";

                // Build a client application.
                IConfidentialClientApplication confidentialClientApplication = ConfidentialClientApplicationBuilder
                                .Create(clientId)
                                .WithTenantId(tenantID)
                                .WithClientSecret(clientSecret)
                                .Build();
                ClientCredentialProvider authenticationProvider = new ClientCredentialProvider(confidentialClientApplication);
                await authenticationProvider.AuthenticateRequestAsync(message);
                var httpClient = new HttpClient();
                var response = await httpClient.SendAsync(message);
                log.LogInformation($"The Endpoint being called {message.RequestUri.ToString()}");
                log.LogInformation($"The HTTP response message is {response}");
            }
            catch (Exception)
            {

                throw;
            }
        }




        /// Utilities for Graph to work//
        /// 
        private static GraphServiceClient GetAuthenticatedGrahClient()
        {

            var clientId = "eca17835-d15c-4eaf-b5d8-ae24a0e6ac6e";
            var tenantID = "42cfaa48-a49e-4e95-b6f0-ab7b4b60d8a1";
            var clientSecret = "c27wSKS9GePpf6Gk~Np-4mrbrtLEO5-5~n";

            // Build a client application.
            IConfidentialClientApplication confidentialClientApplication = ConfidentialClientApplicationBuilder
                            .Create(clientId)
                            .WithTenantId(tenantID)
                            .WithClientSecret(clientSecret)
                            .Build();
            ClientCredentialProvider authenticationProvider = new ClientCredentialProvider(confidentialClientApplication);
            var stuff = new System.Net.Http.HttpRequestMessage { RequestUri = new Uri("https://graph.microsoft.com/beta/me") };
            authenticationProvider.AuthenticateRequestAsync(stuff).GetAwaiter().GetResult();
            GraphServiceClient graphClient = new GraphServiceClient(authenticationProvider);

            return graphClient;
        }

    }
}
