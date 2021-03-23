using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using azurefunct.Helper;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Azure.Cosmos;

namespace azurefunct.CreateProductInCosmosDB
{
    public static class httpCosmosInsert
    {
        //Static List to hold items for Updates
        static List<Product> prd = new List<Product>();

        [FunctionName("InsertProduct")]
        public static async Task<IActionResult> CreateProduct([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [CosmosDB(
            databaseName: "mgcstoredb",
            collectionName: "mgcproductcatalog",
            ConnectionStringSetting = "mgcstoreCosmosDBConn")] IAsyncCollector<Product> createProduct,
            ILogger log)
        {
            log.LogInformation("Entry into the Insert New Product Function has occured...");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            Product input = JsonConvert.DeserializeObject<Product>(requestBody);

            log.LogInformation($"Input Payload is: {input}");

            var acc = new Product()
            {
                Title = input.Title,
                ThumbnailUrl = input.ThumbnailUrl,
                Company = input.Company,
                Category = input.Category,
                Description = input.Description,
                Price = input.Price,
                Url = input.Url,
                Audience = input.Audience
            };
            await createProduct.AddAsync(acc);

            log.LogInformation($"Product Record Added... Work is Finished");

            return acc != null
                ? (ActionResult)new OkObjectResult(acc)
                : new BadRequestObjectResult("Please pass a valid Product JSON Payload in the request body");
        }

        [FunctionName("GetAllProducts")]
        public static IActionResult GetAllProducts([HttpTrigger(AuthorizationLevel.Anonymous, "get")]HttpRequest req,
            [CosmosDB(
            databaseName: "mgcstoredb",
            collectionName: "mgcproductcatalog",
            ConnectionStringSetting = "mgcstoreCosmosDBConn",
            SqlQuery = "SELECT * FROM a order by a._ts desc")] IEnumerable<Product> allProducts,
            ILogger log)
        {
            log.LogInformation("Getting all Products that sort by entrydate ...");
            return new OkObjectResult(allProducts);
        }



        //Insert Product using SDK
        [FunctionName("AddProduct")]
        public static async Task<IActionResult> InsertProduct(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")]HttpRequest req,
            ILogger log)
        {
            var container = SharedCosmosClient.Client.GetContainer("mgcstoredb", "mgcproductcatalog");
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            Product input = JsonConvert.DeserializeObject<Product>(requestBody);

            if (input != null)
            {
                await container.CreateItemAsync(input, new PartitionKey(input.Title));
                log.LogInformation("Entry into the Insert New Product Function has occured...");
            }
            log.LogInformation($"Created new Product {input.Title} from Sebs React Component");
            return new OkResult();
        }


        //Update Product using SDK
        [FunctionName("UpdateProduct")]
        public static async Task<IActionResult> ReplaceProduct(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put")]HttpRequest req,
            ILogger log)
        {
            var container = SharedCosmosClient.Client.GetContainer("mgcstoredb", "mgcproductcatalog");
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            Product input = JsonConvert.DeserializeObject<Product>(requestBody);
            var sqlQuery = $"SELECT * FROM a WHERE a.id = '{input.Id}'";
            var iterator0 = container.GetItemQueryIterator<Product>(sqlQuery);
            Product docReturned = await iterator0.ReadNextAsync();
           // Product docReturned = JsonConvert.DeserializeObject<Product>(payload);

            if (docReturned != null)
            {
                docReturned.Title = input.Title;
                docReturned.ThumbnailUrl = input.ThumbnailUrl;
                docReturned.Company = input.Company;
                docReturned.Category = input.Category;
                docReturned.Description = input.Description;
                docReturned.Price = input.Price;
                docReturned.Url = input.Url;
                docReturned.Audience = input.Audience;
                var result = await container.ReplaceItemAsync<Product>(docReturned, (string)docReturned.Id);
                var updatedDoc = result.Resource;
                log.LogInformation($"Updated Product: {updatedDoc.Title} from Sebs React Component");
            }

            return new OkResult();
        }

        //Find Product using StartsWith
        [FunctionName("GetProductUsingStartsWith")]
        public static async Task<IActionResult> GetProductsStartsWith(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")]HttpRequest req,
            ILogger log)
        {
            var container = SharedCosmosClient.Client.GetContainer("mgcstoredb", "mgcproductcatalog");
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            Product input = JsonConvert.DeserializeObject<Product>(requestBody);
            var sqlQuery = $"SELECT * FROM a WHERE STARTSWITH(a.title, '{input.Title}') = true";
            var iterator1 = container.GetItemQueryIterator<Product>(sqlQuery);
            var doc1 = await iterator1.ReadNextAsync();

            return new OkObjectResult(doc1);
        }

        //Find Product by ID
        [FunctionName("GetProductById")]
        public static async Task<IActionResult> FindProductsById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")]HttpRequest req,
            ILogger log)
        {
            var container = SharedCosmosClient.Client.GetContainer("mgcstoredb", "mgcproductcatalog");
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            Product input = JsonConvert.DeserializeObject<Product>(requestBody);
            var sqlQuery = $"SELECT * FROM a WHERE a.id = '{input.Id}'";
            var iterator1 = container.GetItemQueryIterator<Product>(sqlQuery);
            var doc1 = await iterator1.ReadNextAsync();

            return new OkObjectResult(doc1);
        }

        //Delete Product using ID
        [FunctionName("DeleteProduct")]
        public static async Task<IActionResult> RemoveProduct(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete")]HttpRequest req,
            ILogger log)
        {
            var container = SharedCosmosClient.Client.GetContainer("mgcstoredb", "mgcproductcatalog");
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            Product input = JsonConvert.DeserializeObject<Product>(requestBody);
            var sqlQuery = $"SELECT a.id FROM a WHERE a.id = '{input.Id}'";
            var iterator2 = container.GetItemQueryIterator<Product>(sqlQuery);
            var doctodelete = await iterator2.ReadNextAsync();

                    string id = input.Id;
                    string pk = input.Title;
                    await container.DeleteItemAsync<Product>(id, new PartitionKey(pk));
            //log.LogInformation($"Created new Product {input.Title} from Sebs React Component");
            return new OkResult();
        }

    }
}
