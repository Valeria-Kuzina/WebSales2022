using System.Text.Json.Serialization;

namespace ElectronixStoreWeb.Models
{
    public class ProductOrder
    {
        public int ProductId { get; set; }
        public virtual Product Product { get; set; }
        public int OrderId { get; set; }

        [JsonIgnore]
        public virtual Order Order { get; set; }
        public int Amount { get; set; }
    }
}
