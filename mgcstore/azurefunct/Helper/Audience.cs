using System;
using Newtonsoft.Json;

namespace azurefunct.Helper
{
   public partial class Audience
    {
        [JsonProperty("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString("n");
        [JsonProperty("type")]
        public string Type { get; set; }
    }
}
