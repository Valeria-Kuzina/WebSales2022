using System;
using System.Collections.Generic;

namespace ElectronixStoreWeb.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime CreationTime { get; set; }
        public virtual ICollection<ProductOrder> Products { get; set; }
        public bool IsCompleted { get; set; }
    }
}
