using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Remnant
{
    [Key]
    public string ID { get; set; } = null!;
    public string IDStock { get; set; } = null!;
    public decimal InStockT { get; set; }
    public decimal InStockM { get; set; }
    public decimal AvgTubeLength { get; set; }
    public decimal AvgTubeWeight { get; set; }
    public Nomenclature Nomenclature { get; set; } = null!;
    public Stock Stock { get; set; } = null!;
}
