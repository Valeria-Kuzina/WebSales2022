using ElectronixStoreWeb.Database;
using ElectronixStoreWeb.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace ElectronixStoreWeb.Controllers
{
    public class ProductsService
    {
        private readonly ApplicationContext applicationContext;

        public ProductsService(ApplicationContext applicationContext)
        {
            this.applicationContext = applicationContext;
        }

        public IQueryable<Product> Products =>
            applicationContext.Products.AsNoTracking();

        public IQueryable<Category> Categories =>
            applicationContext.Categories.AsNoTracking();

        public async Task SaveCategoryAsync(Category category)
        {
            if (category.Id == default)
            {
                applicationContext.Categories.Add(category);
            }
            else
            {
                applicationContext.Entry(category).State = EntityState.Modified;
            }

            await applicationContext.SaveChangesAsync();
        }

        public async Task<Product> SaveProductAsync(Product product)
        {
            if (product.Id == default)
            {
                applicationContext.Products.Add(product);
            }
            else
            {
                applicationContext.Entry(product).State = EntityState.Modified;
            }

            await applicationContext.SaveChangesAsync();

            return product;
        }
    }
}
