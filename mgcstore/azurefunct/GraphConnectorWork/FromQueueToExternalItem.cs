using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
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
    public static class FromQueueToExternalItem
    {
        //Static List to hold items for Updates

        [FunctionName("FromQueueToExternalItem")]
        //TODO- CHANGE THE NAME OF THE QUEUE BELOW SO IT CAN ACTUALLY LISTEN. FOR NOW I WANT IT TO STACK UP SO I CAN TEST IT. 
        public static async System.Threading.Tasks.Task RunAsync([QueueTrigger("mgcstoreproduct-dontmonitor", Connection = "AzureWebJobsStorage")]string myQueueItem, ILogger log)
        {
            GraphServiceClient graphClient = GetAuthenticatedGrahClient();
            //log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");

            var data = JsonConvert.DeserializeObject<archiveProduct>(myQueueItem);

            log.LogInformation($"C# Raw Data Deserialized: {data}");

            var externalItem = new Microsoft.Graph.ExternalConnectors.ExternalItem
            {
                Acl = new List<Microsoft.Graph.ExternalConnectors.Acl>()
                {
                    new Microsoft.Graph.ExternalConnectors.Acl
                    {
                        Type = Microsoft.Graph.ExternalConnectors.AclType.User,
                        Value = "bac58813-8954-4633-9503-cc51c0ab34c9",
                        AccessType = Microsoft.Graph.ExternalConnectors.AccessType.Grant,
                        IdentitySource = Microsoft.Graph.ExternalConnectors.IdentitySourceType.AzureActiveDirectory
                    },
                    new Microsoft.Graph.ExternalConnectors.Acl
                    {
                        Type = Microsoft.Graph.ExternalConnectors.AclType.User,
                        Value = "81d94c38-9389-4b00-8769-914130bd1909",
                        AccessType = Microsoft.Graph.ExternalConnectors.AccessType.Grant,
                        IdentitySource = Microsoft.Graph.ExternalConnectors.IdentitySourceType.AzureActiveDirectory
                    },
                    new Microsoft.Graph.ExternalConnectors.Acl
                    {
                        Type = Microsoft.Graph.ExternalConnectors.AclType.User,
                        Value = "5e2ff59c-bc04-4bbe-b046-03acd420b71a",
                        AccessType = Microsoft.Graph.ExternalConnectors.AccessType.Grant,
                        IdentitySource = Microsoft.Graph.ExternalConnectors.IdentitySourceType.AzureActiveDirectory
                    },
                    new Microsoft.Graph.ExternalConnectors.Acl
                    {
                        Type = Microsoft.Graph.ExternalConnectors.AclType.Group,
                        Value ="f0a3aa8f-0269-4123-950b-d2e87e782af2",
                        AccessType = Microsoft.Graph.ExternalConnectors.AccessType.Grant,
                        IdentitySource = Microsoft.Graph.ExternalConnectors.IdentitySourceType.AzureActiveDirectory
                    },
                    new Microsoft.Graph.ExternalConnectors.Acl
                    {
                        Type = Microsoft.Graph.ExternalConnectors.AclType.Group,
                        Value = "e63e0c30-c44c-4a9c-a68e-e57bf830ac2b",
                        AccessType = Microsoft.Graph.ExternalConnectors.AccessType.Grant,
                        IdentitySource = Microsoft.Graph.ExternalConnectors.IdentitySourceType.AzureActiveDirectory
                    },
                    new Microsoft.Graph.ExternalConnectors.Acl
                    {
                        Type = Microsoft.Graph.ExternalConnectors.AclType.Group,
                        Value = "7f6c5436-f148-4b53-8117-403e1ad6ec80",
                        AccessType = Microsoft.Graph.ExternalConnectors.AccessType.Grant,
                        IdentitySource = Microsoft.Graph.ExternalConnectors.IdentitySourceType.AzureActiveDirectory
                    }
                },
                Properties = new Microsoft.Graph.ExternalConnectors.Properties
                {
                    AdditionalData = new Dictionary<string, object>()
                    {
                        //{"id", data.Id},
                        {"title", data.Title},
                        {"thumbnailUrl", data.ThumbnailUrl},
                        {"company", data.Company},
                        {"category", data.Category},
                        {"description", data.Description},
                        {"price", data.Price.ToString()},
                        {"url ", data.Url},
                    }
                },
                Content = new Microsoft.Graph.ExternalConnectors.ExternalItemContent
                {
                    Value = data.Description,
                    Type = Microsoft.Graph.ExternalConnectors.ExternalItemContentType.Text
                }
            };

            //var ei = JsonConvert.DeserializeObject<ExternalItem>(externalItem);
            //log.LogInformation($"External Item is: {ei}");

            string currItemId = data.Id.ToString();
            log.LogInformation($"Item Id being sent is: {currItemId}");
            string currConnectionId = "fhlspring21mgcstorebravo";
            log.LogInformation($"Connection ID of the External Conn: {currConnectionId}");
            log.LogInformation($"Payload from the Queue being monitored: {myQueueItem}");

            try
            {
                var mycall = graphClient.External.Connections[currConnectionId].Items[currItemId]
                    .Request();
                //await graphClient.External.Connections[currConnectionId].Items[currItemId]
                    //.Request().CreateAsync(externalItem);
                var rawItem = graphClient.HttpProvider.Serializer.SerializeAsJsonContent(externalItem);
                var addRequest = mycall.GetHttpRequestMessage();
                addRequest.Method = HttpMethod.Put;
                addRequest.Content = rawItem;
                var batchRequestContent = new BatchRequestContent();
                var addRequestId = batchRequestContent.AddBatchRequestStep(addRequest);
                var returnedResponse = await graphClient.Batch.Request().PostAsync(batchRequestContent);
            }
            catch (Exception ex)
            {
                log.LogInformation($"The errr is {ex.Message}");
            }

        }


        [FunctionName("GetAllUsers")]
        public static async Task<IActionResult> GetAllUsersFromGraph(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
        ILogger log)
        {

            GraphServiceClient graphClient = GetAuthenticatedGrahClient();
            List<QueryOption> options = new List<QueryOption>
            {
                new QueryOption("$select", "displayName,givenName,mail")
            };

            var graphResult = graphClient.Users.Request(options).GetAsync().Result;

            List<User> usersList = graphResult.CurrentPage.ToList();

            foreach (User u in usersList)
            {
                log.LogInformation("Showing: " + u.GivenName + " - " + u.Mail);
            }

            log.LogInformation("Graph SDK Result for All Users");

            string responseMessage = string.IsNullOrEmpty(graphResult.ToString())
                ? "Call to Microsoft Graph on Fabster Tenanat App executed successfully."
                : $"{graphResult}";

            return new OkObjectResult(usersList);
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
