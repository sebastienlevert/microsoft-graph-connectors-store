using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace azurefunct.Helper
{
    public static class SharedCosmosClient
    {
        public static CosmosClient Client { get; private set; }

        static SharedCosmosClient()
        {
            /*
            var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            var endpoint = config["endpoint"];
            var masterKey = config["masterKey"];
            */
            var endpoint = "https://mgcstore.documents.azure.com:443/";
            var masterKey = "Q2RSWLujzIeeIHMmdiiCkbFkFDiR6DVyFx2tagNuUcv6gI0qlnu5vmIw2cfOnR0rm1ArJJBX9Ydgs8SYX10lXQ==";
               
            Client = new CosmosClient(endpoint, masterKey);
        }
    }
}
