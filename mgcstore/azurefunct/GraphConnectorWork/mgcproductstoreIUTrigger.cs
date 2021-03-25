using System;
using System.Collections.Generic;
using System.Linq;
using azurefunct.Helper;
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace azurefunct
{
    public static class mgcproductstoreIUTrigger
    {
        //Static List to hold items for Updates
        static List<archiveProduct> prd = new List<archiveProduct>();

        [FunctionName("mgcproductstoreIUTrigger")]
        public static async System.Threading.Tasks.Task CosmosDBTriggerAsync([CosmosDBTrigger(
            databaseName: "mgcstoredb",
            collectionName: "mgcproductcatalog",
            ConnectionStringSetting = "mgcstoreCosmosDBConn",
            LeaseCollectionName = "leases",
            CreateLeaseCollectionIfNotExists = true)]IReadOnlyList<Document> input, ILogger log,
            [Queue("mgcstoreproduct", Connection = "AzureWebJobsStorage")] IAsyncCollector<string> outputQueue,
            [Table("mgcstoreproduct", Connection = "AzureWebJobsStorage")] IAsyncCollector<archiveProduct> outputTable)
        {
            //[Table("mgcstoreproduct", Connection = "AzureWebJobsStorage")] IAsyncCollector<string> outputTable

            if (input != null && input.Count > 0)
            {

                prd.Add(new archiveProduct()
                {
                    PartitionKey = "MGCProducts",
                    RowKey = input[0].Id,
                    Title = input[0].GetPropertyValue<string>("title"),
                    ThumbnailUrl = input[0].GetPropertyValue<string>("thumbnailUrl"),
                    Company = input[0].GetPropertyValue<string>("company"),
                    Category = input[0].GetPropertyValue<string>("category"),
                    Description = input[0].GetPropertyValue<string>("description"),
                    Price = Convert.ToDouble(input[0].GetPropertyValue<string>("price")),
                    Url = input[0].GetPropertyValue<string>("url")
                });

                
                var data = JsonConvert.SerializeObject(prd);

                
                var rmvsqrbrakcket = data.Replace("[{", "{").Replace("}]", "}");
                var tabledata = JsonConvert.DeserializeObject<archiveProduct>(rmvsqrbrakcket);
                    tabledata.PartitionKey = "MGCProducts";
                    tabledata.RowKey = input[0].Id;

                

                //write to Azure Queue
                await outputQueue.AddAsync(data);
                //await outputQueue.AddAsync(data);
                //now write to Azure Table Storage
                await outputTable.AddAsync(tabledata);
                log.LogInformation("Documents modified " + input.Count);
                //log.LogInformation("First document Id " + input[0].Id + " with Product Name " + input[0].Title);
            }
        }
    }
}
