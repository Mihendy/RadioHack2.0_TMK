using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Nomenclature
{
    [Key]
    public string ID { get; set; } = null!;
    public string IDCat { get; set; } = null!;
    public string IDType { get; set; } = null!;
    public string IDTypeNew { get; set; } = null!;
    public string ProductionType { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Gost { get; set; } = null!;
    public string FormOfLength { get; set; } = null!;
    public string Manufacturer { get; set; } = null!;
    public string SteelGrade { get; set; } = null!;
    public double Diameter { get; set; }
    public double PipeWallThickness { get; set; }
    public int Status { get; set; }
    public double Koef { get; set; }

    public PipeType? PipeType { get; set; }
    public List<Price> Prices { get; set; } = [];
    public List<Remnant> Remnants { get; set; } = [];
}