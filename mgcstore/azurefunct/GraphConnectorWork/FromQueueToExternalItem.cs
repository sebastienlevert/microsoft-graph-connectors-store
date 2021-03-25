using System;
using System.Collections.Generic;
using azurefunct.Helper;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.Graph.Auth;
using Microsoft.Identity.Client;
using Newtonsoft.Json;

namespace azurefunct.GraphConnectorWork
{
    public static class FromQueueToExternalItem
    {
        //Static List to hold items for Updates

        [FunctionName("FromQueueToExternalItem")]
        //TODO- CHANGE THE NAME OF THE QUEUE BELOW SO IT CAN ACTUALLY LISTEN. FOR NOW I WANT IT TO STACK UP SO I CAN TEST IT. 
        public static async System.Threading.Tasks.Task RunAsync([QueueTrigger("mgcstoreproduct", Connection = "AzureWebJobsStorage")]string myQueueItem, ILogger log)
        {
            GraphServiceClient graphClient = GetAuthenticatedGrahClient();
            log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");

            var data = JsonConvert.DeserializeObject<archiveProduct>(myQueueItem);
            var externalItem = new ExternalItem
            {
                Acl = new List<Microsoft.Graph.Acl>()
    {
                    new Microsoft.Graph.Acl
                    {
                        Type = AclType.User,
                        Value = "bac58813-8954-4633-9503-cc51c0ab34c9",
                        AccessType = AccessType.Grant,
                        IdentitySource = "azureActiveDirectory"
                    },
                    new Microsoft.Graph.Acl
                    {
                        Type = AclType.User,
                        Value = "81d94c38-9389-4b00-8769-914130bd1909",
                        AccessType = AccessType.Grant,
                        IdentitySource = "azureActiveDirectory"
                    },
                    new Microsoft.Graph.Acl
                    {
                        Type = AclType.User,
                        Value = "5e2ff59c-bc04-4bbe-b046-03acd420b71a",
                        AccessType = AccessType.Grant,
                        IdentitySource = "azureActiveDirectory"
                    },
                    new Microsoft.Graph.Acl
                    {
                        Type = AclType.Group,
                        Value ="f0a3aa8f-0269-4123-950b-d2e87e782af2",
                        AccessType = AccessType.Grant,
                        IdentitySource = "azureActiveDirectory"
                    },
                    new Microsoft.Graph.Acl
                    {
                        Type = AclType.Group,
                        Value = "e63e0c30-c44c-4a9c-a68e-e57bf830ac2b",
                        AccessType = AccessType.Grant,
                        IdentitySource = "azureActiveDirectory"
                    },
                    new Microsoft.Graph.Acl
                    {
                        Type = AclType.Group,
                        Value = "7f6c5436-f148-4b53-8117-403e1ad6ec80",
                        AccessType = AccessType.Grant,
                        IdentitySource = "azureActiveDirectory"
                    }
                },
                Properties = new Microsoft.Graph.Properties
                {
                    AdditionalData = new Dictionary<string, object>()
                    {
                        {"id", data.Id},
                        {"title", data.Title},
                        {"thumbnailUrl", data.ThumbnailUrl},
                        {"company", data.Company},
                        {"category", data.Category},
                        {"description", data.Description},
                        {"price", data.Price},
                        {"url ", data.Url},
                    }
                            },
                Content = new ExternalItemContent
                {
                    Value = data.Description,
                    Type = ExternalItemContentType.Text
                }
            };


            await graphClient.Connections["fhlspring21mgcstorebravo"].Items[data.Id.ToString()]
                                .Request()
                                .PutAsync(externalItem);

            //log.LogInformation($"C# Fabian ProcessAccolade Queue Function completded..: {graphResult}");
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
            GraphServiceClient graphClient = new GraphServiceClient(authenticationProvider);

            return graphClient;
        }

    }
}
