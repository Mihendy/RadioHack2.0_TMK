using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

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

    [JsonIgnore]
    public Nomenclature? Nomenclature { get; set; }
    [JsonIgnore]
    public Stock? Stock { get; set; }
}
