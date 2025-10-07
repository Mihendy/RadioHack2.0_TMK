using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class OrderItem
{
    [Key]
    public Guid ID { get; set; }
    public Guid OrderID { get; set; }
    public string NomenclatureID { get; set; } = null!;
    public string StockID { get; set; } = null!;
    public decimal QuantityInTons { get; set; }
    public decimal QuantityInMeters { get; set; }

    public Order? Order { get; set; }
    public Nomenclature? Nomenclature { get; set; }
    public Stock? Stock { get; set; }
}