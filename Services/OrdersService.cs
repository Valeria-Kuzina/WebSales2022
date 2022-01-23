using ElectronixStoreWeb.Database;
using ElectronixStoreWeb.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElectronixStoreWeb.Services
{
    public class OrdersService
    {
        private readonly ApplicationContext context;

        public OrdersService(ApplicationContext context)
        {
            this.context = context;
        }

        public async Task<Order> GetCurrentOrderAsync()
        {
            var order = await context.Orders
                .Include(x => x.Products)
                .Where(x => !x.IsCompleted)
                .OrderByDescending(x => x.CreationTime).FirstOrDefaultAsync();

            if (order == null)
            {
                order = new Order { CreationTime = DateTime.UtcNow, Products = new List<ProductOrder>() };
                context.Orders.Add(order);
            }

            await context.SaveChangesAsync();

            context.Entry(order).State = EntityState.Detached;
            return order;
        }

        public Task<List<Order>> GetOrdersAsync() =>
            context.Orders.AsNoTracking().Include(x => x.Products)
                .Where(x => x.IsCompleted).OrderBy(x => x.CreationTime).ToListAsync();

        public Task<Order> GetOrderAsync(int orderId) =>
            context.Orders.AsNoTracking().Include(x => x.Products)
                .FirstOrDefaultAsync(x => x.Id == orderId);

        public async Task SetProductOrderAmount(int orderId, int productId, int amount)
        {
            var order = await context.Orders.Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == orderId);
            if (!order.Products.Any(x => x.ProductId == productId))
                order.Products.Add(new ProductOrder { ProductId = productId });

            var productOrder = order.Products.First(x => x.ProductId == productId);
            productOrder.Amount = amount;

            await context.SaveChangesAsync();
        }

        public async Task RemoveProductOrderAsync(int orderId, int productId)
        {
            var order = await context.Orders.Include(x => x.Products).FirstOrDefaultAsync(x => x.Id == orderId);
            var productOrder = order.Products.FirstOrDefault(x => x.ProductId == productId);

            if (productOrder != null)
                order.Products.Remove(productOrder);

            await context.SaveChangesAsync();
        }

        public async Task SetOrderCompleted(int orderId)
        {
            var order = await context.Orders.FirstOrDefaultAsync(x => x.Id == orderId);
            order.IsCompleted = true;
            await context.SaveChangesAsync();
        }
    }
}
