using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class PipeType
{
    [Key]
    public string IDType { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;

    public List<Nomenclature> Nomenclatures { get; set; } = [];
}