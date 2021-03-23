using System;
using System.Collections.Generic;
using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;

namespace azurefunct.Helper
{
    public partial class Product
    {
        [JsonProperty("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString("n");
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("thumbnailUrl")]
        public string ThumbnailUrl { get; set; }
        [JsonProperty("company")]
        public string Company { get; set; }
        [JsonProperty("category")]
        public string Category { get; set; }
        [JsonProperty("description")]
        public string Description { get; set; }
        [JsonProperty("price")]
        public double Price { get; set; }
        [JsonProperty("url")]
        public string Url { get; set; }
        [JsonProperty("audience")]
        public List<Audience> Audience { get; set; }

        public static implicit operator Product(FeedResponse<Product> v)
        {
            throw new NotImplementedException();
        }
    }
}
