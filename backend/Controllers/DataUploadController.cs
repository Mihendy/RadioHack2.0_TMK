namespace backend.Controllers;

using backend.Data;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

[ApiController]
[Route("api/upload")]
public class DataUploadController : ControllerBase
{
    private readonly AppDbContext _db;

    public DataUploadController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("types")]
    public async Task<IActionResult> UploadTypes([FromBody] PipeTypeUploadDto dto)
    {   
        var types = dto.ArrayOfTypeEl;

        if (types == null || types.Count == 0) return BadRequest("No types provided");

        using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            _db.PipeTypes.RemoveRange(_db.PipeTypes);
            await _db.SaveChangesAsync();



            _db.PipeTypes.AddRange(types.Select(n => new PipeType
            {
                IDType = n.IDType,
                Type = n.Type,
            }));

            await _db.SaveChangesAsync();

            await transaction.CommitAsync();
            return Ok("Types replaced successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }


    [HttpPost("nomenclature")]
    public async Task<IActionResult> UploadNomenclature([FromBody] NomenclatureUploadDto dto)
    {
        var nomenclature = dto.ArrayOfNomenclatureEl;

        if (nomenclature == null || nomenclature.Count == 0)
            return BadRequest("No nomenclature provided");

        using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            _db.Nomenclatures.RemoveRange(_db.Nomenclatures);
            await _db.SaveChangesAsync();



            _db.Nomenclatures.AddRange(nomenclature.Select(n => new Nomenclature
            {
                ID = n.ID,
                IDCat = n.IDCat,
                Name = n.Name,
                IDType = n.IDType,
                IDTypeNew = n.IDTypeNew,
                ProductionType = n.ProductionType,
                Gost = n.Gost,
                FormOfLength = n.FormOfLength,
                Manufacturer = n.Manufacturer,
                SteelGrade = n.SteelGrade,
                Diameter = n.Diameter,
                PipeWallThickness = n.PipeWallThickness,
                Status = n.Status,
                Koef = n.Koef
            }));

            await _db.SaveChangesAsync();

            await transaction.CommitAsync();
            return Ok("Nomenclature replaced successfully");
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23503")
        {
            // 23503 = FK violation
            return BadRequest(new
            {
                error = "Foreign key constraint violation",
                detail = pgEx.Detail,
                constraint = pgEx.ConstraintName
            });
        }
    }


    [HttpPost("stocks")]
    public async Task<IActionResult> UploadStocks([FromBody] StockUploadDto dto)
    {
        var stocks = dto.ArrayOfStockEl;

        if (stocks == null || stocks.Count == 0)
            return BadRequest("No stocks provided");

        using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            _db.Stocks.RemoveRange(_db.Stocks);
            await _db.SaveChangesAsync();

            _db.Stocks.AddRange(stocks.Select(n => new Stock
            {
                IDStock = n.IDStock,
                City = n.City,
                StockName = n.StockName
            }));

            await _db.SaveChangesAsync();

            await transaction.CommitAsync();
            return Ok("Stocks replaced successfully");
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23503")
        {
            // 23503 = FK violation
            return BadRequest(new
            {
                error = "Foreign key constraint violation",
                detail = pgEx.Detail,
                constraint = pgEx.ConstraintName
            });
        }
    }

    [HttpPost("prices")]
    public async Task<IActionResult> UploadPrices([FromBody] PriceTypeUploadDto dto)
    {
        var prices = dto.ArrayOfPricesEl;

        if (prices == null || prices.Count == 0)
            return BadRequest("No prices provided");

        using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            _db.Prices.RemoveRange(_db.Prices);
            await _db.SaveChangesAsync();

            _db.Prices.AddRange(prices.Select(n => new Price
            {
                ID = n.ID,
                IDStock = n.IDStock,
                PriceT = n.PriceT,
                PriceLimitT1 = n.PriceLimitT1,
                PriceT1 = n.PriceT1,
                PriceLimitT2 = n.PriceLimitT2,
                PriceT2 = n.PriceT2,
                PriceM = n.PriceM,
                PriceLimitM1 = n.PriceLimitM1,
                PriceM1 = n.PriceM1,
                PriceLimitM2 = n.PriceLimitM2,
                PriceM2 = n.PriceM2,
                NDS = n.NDS
            }));

            await _db.SaveChangesAsync();

            await transaction.CommitAsync();
            return Ok("Prices replaced successfully");
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23503")
        {
            // 23503 = FK violation
            return BadRequest(new
            {
                error = "Foreign key constraint violation",
                detail = pgEx.Detail,
                constraint = pgEx.ConstraintName
            });
        }
    }

    [HttpPost("remnants")]
    public async Task<IActionResult> UploadRemnants([FromBody] RemnantUploadDto dto)
    {
        var remnants = dto.ArrayOfRemnantsEl;

        if (remnants == null || remnants.Count == 0)
            return BadRequest("No remnants provided");

        using var transaction = await _db.Database.BeginTransactionAsync();

        try
        {
            _db.Remnants.RemoveRange(_db.Remnants);
            await _db.SaveChangesAsync();

            _db.Remnants.AddRange(remnants.Select(n => new Remnant
            {
                ID = n.ID,
                IDStock = n.IDStock,
                InStockT = n.InStockT,
                InStockM = n.InStockM,
                AvgTubeLength = n.AvgTubeLength,
                AvgTubeWeight = n.AvgTubeWeight
            }));

            await _db.SaveChangesAsync();

            await transaction.CommitAsync();
            return Ok("Remnants replaced successfully");
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23503")
        {
            return BadRequest(new
            {
                error = "Foreign key constraint violation",
                detail = pgEx.Detail,
                constraint = pgEx.ConstraintName
            });
        }
    }
}
