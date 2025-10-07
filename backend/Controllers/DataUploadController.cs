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
    public async Task<IActionResult> SyncTypes([FromBody] PipeTypeUploadDto dto)
    {
        var types = dto.ArrayOfTypeEl;
        if (types == null || types.Count == 0)
            return BadRequest("No types provided");

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var existingTypes = await _db.PipeTypes.ToListAsync();
            var incomingIds = types.Select(t => t.IDType).ToHashSet();

            // Добавляем новые
            var toAdd = types
                .Where(t => existingTypes.All(et => et.IDType != t.IDType))
                .Select(n => new PipeType
                {
                    IDType = n.IDType,
                    Type = n.Type
                })
                .ToList();

            // Обновляем существующие
            foreach (var existing in existingTypes.Where(et => incomingIds.Contains(et.IDType)))
            {
                var incoming = types.First(t => t.IDType == existing.IDType);
                existing.Type = incoming.Type;
            }

            // Удаляем те, которых нет в новых данных
            var toDelete = existingTypes
                .Where(et => !incomingIds.Contains(et.IDType))
                .ToList();

            if (toDelete.Count > 0)
                _db.PipeTypes.RemoveRange(toDelete);

            if (toAdd.Count > 0)
                _db.PipeTypes.AddRange(toAdd);

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                added = toAdd.Count,
                updated = existingTypes.Count(et => incomingIds.Contains(et.IDType)),
                deleted = toDelete.Count
            });
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
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("stocks")]
    public async Task<IActionResult> SyncStocks([FromBody] StockUploadDto dto)
    {
        var stocks = dto.ArrayOfStockEl;
        if (stocks == null || stocks.Count == 0)
            return BadRequest("No stocks provided");

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var existingStocks = await _db.Stocks.ToListAsync();

            var incomingIds = stocks.Select(s => s.IDStock).ToHashSet();

            // Новые — те, которых нет в базе
            var toAdd = stocks
                .Where(s => existingStocks.All(es => es.IDStock != s.IDStock))
                .Select(n => new Stock
                {
                    IDStock = n.IDStock,
                    City = n.City,
                    StockName = n.StockName
                })
                .ToList();

            // Обновляем существующие
            foreach (var existing in existingStocks.Where(es => incomingIds.Contains(es.IDStock)))
            {
                var incoming = stocks.First(s => s.IDStock == existing.IDStock);
                existing.City = incoming.City;
                existing.StockName = incoming.StockName;
            }

            // Удаляем те, которых нет в новых данных
            var toDelete = existingStocks
                .Where(es => !incomingIds.Contains(es.IDStock))
                .ToList();

            if (toDelete.Count > 0)
                _db.Stocks.RemoveRange(toDelete);

            if (toAdd.Count > 0)
                _db.Stocks.AddRange(toAdd);

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                added = toAdd.Count,
                updated = existingStocks.Count(es => incomingIds.Contains(es.IDStock)),
                deleted = toDelete.Count
            });
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
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("nomenclature")]
    public async Task<IActionResult> SyncNomenclature([FromBody] NomenclatureUploadDto dto)
    {
        var nomenclature = dto.ArrayOfNomenclatureEl;
        if (nomenclature == null || nomenclature.Count == 0)
            return BadRequest("No nomenclature provided");

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var existingNomenclature = await _db.Nomenclatures.ToListAsync();
            var incomingIds = nomenclature.Select(n => n.ID).ToHashSet();

            // Добавляем новые
            var toAdd = nomenclature
                .Where(n => existingNomenclature.All(en => en.ID != n.ID))
                .Select(n => new Nomenclature
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
                })
                .ToList();

            // Обновляем существующие
            foreach (var existing in existingNomenclature.Where(en => incomingIds.Contains(en.ID)))
            {
                var incoming = nomenclature.First(n => n.ID == existing.ID);
                existing.IDCat = incoming.IDCat;
                existing.Name = incoming.Name;
                existing.IDType = incoming.IDType;
                existing.IDTypeNew = incoming.IDTypeNew;
                existing.ProductionType = incoming.ProductionType;
                existing.Gost = incoming.Gost;
                existing.FormOfLength = incoming.FormOfLength;
                existing.Manufacturer = incoming.Manufacturer;
                existing.SteelGrade = incoming.SteelGrade;
                existing.Diameter = incoming.Diameter;
                existing.PipeWallThickness = incoming.PipeWallThickness;
                existing.Status = incoming.Status;
                existing.Koef = incoming.Koef;
            }

            // Удаляем те, которых нет в новых данных
            var toDelete = existingNomenclature
                .Where(en => !incomingIds.Contains(en.ID))
                .ToList();

            if (toDelete.Count > 0)
                _db.Nomenclatures.RemoveRange(toDelete);

            if (toAdd.Count > 0)
                _db.Nomenclatures.AddRange(toAdd);

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                added = toAdd.Count,
                updated = existingNomenclature.Count(en => incomingIds.Contains(en.ID)),
                deleted = toDelete.Count
            });
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
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("prices")]
    public async Task<IActionResult> SyncPrices([FromBody] PriceTypeUploadDto dto)
    {
        var prices = dto.ArrayOfPricesEl;
        if (prices == null || prices.Count == 0)
            return BadRequest("No prices provided");

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var existingPrices = await _db.Prices.ToListAsync();
            var incomingIds = prices.Select(p => p.ID).ToHashSet();

            var toAdd = prices
                .Where(p => existingPrices.All(ep => ep.ID != p.ID))
                .Select(n => new Price
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
                })
                .ToList();

            foreach (var existing in existingPrices.Where(ep => incomingIds.Contains(ep.ID)))
            {
                var incoming = prices.First(p => p.ID == existing.ID);
                existing.IDStock = incoming.IDStock;
                existing.PriceT = incoming.PriceT;
                existing.PriceLimitT1 = incoming.PriceLimitT1;
                existing.PriceT1 = incoming.PriceT1;
                existing.PriceLimitT2 = incoming.PriceLimitT2;
                existing.PriceT2 = incoming.PriceT2;
                existing.PriceM = incoming.PriceM;
                existing.PriceLimitM1 = incoming.PriceLimitM1;
                existing.PriceM1 = incoming.PriceM1;
                existing.PriceLimitM2 = incoming.PriceLimitM2;
                existing.PriceM2 = incoming.PriceM2;
                existing.NDS = incoming.NDS;
            }

            var toDelete = existingPrices
                .Where(ep => !incomingIds.Contains(ep.ID))
                .ToList();

            if (toDelete.Count > 0)
                _db.Prices.RemoveRange(toDelete);

            if (toAdd.Count > 0)
                _db.Prices.AddRange(toAdd);

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                added = toAdd.Count,
                updated = existingPrices.Count(ep => incomingIds.Contains(ep.ID)),
                deleted = toDelete.Count
            });
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
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("remnants")]
    public async Task<IActionResult> SyncRemnants([FromBody] RemnantUploadDto dto)
    {
        var remnants = dto.ArrayOfRemnantsEl;
        if (remnants == null || remnants.Count == 0)
            return BadRequest("No remnants provided");

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var existingRemnants = await _db.Remnants.ToListAsync();
            var incomingIds = remnants.Select(r => r.ID).ToHashSet();

            // Добавляем новые
            var toAdd = remnants
                .Where(r => existingRemnants.All(er => er.ID != r.ID))
                .Select(n => new Remnant
                {
                    ID = n.ID,
                    IDStock = n.IDStock,
                    InStockT = n.InStockT,
                    InStockM = n.InStockM,
                    AvgTubeLength = n.AvgTubeLength,
                    AvgTubeWeight = n.AvgTubeWeight
                })
                .ToList();

            // Обновляем существующие
            foreach (var existing in existingRemnants.Where(er => incomingIds.Contains(er.ID)))
            {
                var incoming = remnants.First(r => r.ID == existing.ID);
                existing.IDStock = incoming.IDStock;
                existing.InStockT = incoming.InStockT;
                existing.InStockM = incoming.InStockM;
                existing.AvgTubeLength = incoming.AvgTubeLength;
                existing.AvgTubeWeight = incoming.AvgTubeWeight;
            }

            // Удаляем отсутствующие
            var toDelete = existingRemnants
                .Where(er => !incomingIds.Contains(er.ID))
                .ToList();

            if (toDelete.Count > 0)
                _db.Remnants.RemoveRange(toDelete);

            if (toAdd.Count > 0)
                _db.Remnants.AddRange(toAdd);

            await _db.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                added = toAdd.Count,
                updated = existingRemnants.Count(er => incomingIds.Contains(er.ID)),
                deleted = toDelete.Count
            });
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
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
