using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class PipeType
{
    [Key]
    public string IDType { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;

    [JsonIgnore]
    public List<Nomenclature> Nomenclatures { get; set; } = [];
}