using ElectronixStoreWeb.Models;
using Microsoft.EntityFrameworkCore;

namespace ElectronixStoreWeb.Database
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<ProductOrder> ProductOrders { get; set; }

        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.UseIdentityByDefaultColumns();

            modelBuilder.Entity<Category>().HasKey(x => x.Id);

            modelBuilder.Entity<Product>(builder =>
            {
                builder.HasKey(x => x.Id);
                builder.HasOne(x => x.Category).WithMany(x => x.Products)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Order>().HasKey(x => x.Id);

            modelBuilder.Entity<ProductOrder>(builder =>
            {
                builder.HasKey(x => new { x.OrderId, x.ProductId });
                builder.HasOne(x => x.Order).WithMany(x => x.Products).OnDelete(DeleteBehavior.Cascade);
                builder.HasOne(x => x.Product).WithMany().OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
