using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Price
{
    [Key]
    public string ID { get; set; } = null!;
    public string IDStock { get; set; } = null!;
    public decimal PriceT { get; set; }
    public decimal PriceLimitT1 { get; set; }
    public decimal PriceT1 { get; set; }
    public decimal PriceLimitT2 { get; set; }
    public decimal PriceT2 { get; set; }
    public decimal PriceM { get; set; }
    public decimal PriceLimitM1 { get; set; }
    public decimal PriceM1 { get; set; }
    public decimal PriceLimitM2 { get; set; }
    public decimal PriceM2 { get; set; }
    public decimal NDS { get; set; }

    public Nomenclature Nomenclature { get; set; } = null!;
    public Stock Stock { get; set; } = null!;
}