using ElectronixStoreWeb.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElectronixStoreWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductsService productService;

        public ProductsController(ProductsService productService)
        {
            this.productService = productService;
        }

        [HttpGet("")]
        public Task<List<Product>> GetProductsAsync(
            [FromQuery] int categoryId = default,
            [FromQuery] string query = default) =>
            productService.Products
                .Where(x => categoryId == default || x.CategoryId == categoryId)
                .Where(x => query == default ||
                    x.Name.ToLower().Contains(query.ToLower()) ||
                    x.Description.ToLower().Contains(query.ToLower()))
                .OrderBy(x => x.Name).ToListAsync();

        [HttpGet("{id:int}")]
        public Task<Product> GetProductAsync(int id) =>
            productService.Products.FirstAsync(x => x.Id == id);

        [HttpGet("categories")]
        public Task<List<Category>> GetCategoriesAsync() =>
            productService.Categories.OrderBy(x => x.Name).ToListAsync();

        [HttpPost("categories")]
        public Task SaveCategoryAsync([FromBody] Category category) =>
            productService.SaveCategoryAsync(category);

        [HttpGet("categories/{id:int}")]
        public Task<Category> GetCategoriesAsync(int id) =>
            productService.Categories.Include(x => x.Products).FirstAsync(x => x.Id == id);

        [HttpPost("")]
        public Task<Product> SaveProductAsync([FromBody] Product product) =>
            productService.SaveProductAsync(product);
    }
}
