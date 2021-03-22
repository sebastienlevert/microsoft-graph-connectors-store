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

namespace azurefunct.CreateProductInCosmosDB
{
    public static class httpCosmosInsert
    {
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

    }
}
