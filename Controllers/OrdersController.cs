using ElectronixStoreWeb.Models;
using ElectronixStoreWeb.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ElectronixStoreWeb.Controllers
{
    [Route("api/[controller]")]
    public class OrdersController
    {
        private readonly OrdersService ordersService;

        public OrdersController(OrdersService ordersService)
        {
            this.ordersService = ordersService;
        }

        [HttpGet("")]
        public Task<List<Order>> GetOrdersAsync()
            => ordersService.GetOrdersAsync();

        [HttpGet("{orderId:int}")]
        public Task<Order> GetOrderAsync(int orderId)
            => ordersService.GetOrderAsync(orderId);

        [HttpGet("current")]
        public Task<Order> GetCurrentOrderAsync()
            => ordersService.GetCurrentOrderAsync();

        [HttpPost("{orderId:int}/products")]
        public Task SetProductOrderAmount(int orderId, [FromQuery] int productId, [FromQuery] int amount)
            => ordersService.SetProductOrderAmount(orderId, productId, amount);

        [HttpDelete("{orderId:int}/products/{productId:int}")]
        public Task RemoveProductOrderAsync(int orderId, int productId)
            => ordersService.RemoveProductOrderAsync(orderId, productId);

        [HttpPost("{orderId:int}/completed")]
        public Task SetOrderCompleted(int orderId)
            => ordersService.SetOrderCompleted(orderId);
    }
}
