using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<PipeType> PipeTypes { get; set; } = null!;
    public DbSet<Stock> Stocks { get; set; } = null!;
    public DbSet<Nomenclature> Nomenclatures { get; set; } = null!;
    public DbSet<Price> Prices { get; set; } = null!;
    public DbSet<Remnant> Remnants { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderItem> OrderItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
     modelBuilder.Entity<Nomenclature>()
        .HasOne(n => n.PipeType)
        .WithMany(t => t.Nomenclatures)
        .HasForeignKey(n => n.IDType);

    modelBuilder.Entity<Price>()
        .HasOne(p => p.Nomenclature)
        .WithMany(n => n.Prices)
        .HasForeignKey(p => p.ID);

    modelBuilder.Entity<Price>()
        .HasOne(p => p.Stock)
        .WithMany(s => s.Prices)
        .HasForeignKey(p => p.IDStock);

    modelBuilder.Entity<Remnant>()
        .HasOne(r => r.Nomenclature)
        .WithMany(n => n.Remnants)
        .HasForeignKey(r => r.ID);

    modelBuilder.Entity<Remnant>()
        .HasOne(r => r.Stock)
        .WithMany(s => s.Remnants)
        .HasForeignKey(r => r.IDStock);
    }
}
