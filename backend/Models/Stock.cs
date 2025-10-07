using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models;

public class Stock
{
    [Key]
    public string IDStock { get; set; } = string.Empty;

    [JsonPropertyName("Stock")]
    public string City { get; set; } = string.Empty;
    public string StockName { get; set; } = string.Empty;

    public List<Price> Prices { get; set; } = [];
    public List<Remnant> Remnants { get; set; } = [];
}