using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Npgsql.Internal;

namespace backend.Models;

public class Stock
{
    [Key]
    public string IDStock { get; set; } = string.Empty;

    [JsonPropertyName("Stock")]
    public string City { get; set; } = string.Empty;
    public string StockName { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;
    public string Schedule { get; set; } = string.Empty;
    public string IDDivision { get; set; } = string.Empty;
    public bool CashPayment { get; set; } = false;
    public bool CardPayment { get; set; } = false;
    public string FIASId { get; set; } = string.Empty;
    public string OwnerInn { get; set; } = string.Empty;
    public string OwnerKpp { get; set; } = string.Empty;
    public string OwnerFullName { get; set; } = string.Empty;
    public string OwnerShortName { get; set; } = string.Empty;
    public string RailwayStation { get; set; } = string.Empty;
    public string ConsigneeCode { get; set; } = string.Empty;

    public List<Price> Prices { get; set; } = [];
    public List<Remnant> Remnants { get; set; } = [];
}