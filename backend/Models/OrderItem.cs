using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

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

    [JsonIgnore]
    public Order? Order { get; set; }
    [JsonIgnore]
    public Nomenclature? Nomenclature { get; set; }
    [JsonIgnore]
    public Stock? Stock { get; set; }
}