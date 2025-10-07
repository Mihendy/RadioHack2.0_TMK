namespace backend.Controllers;

using Data;
using Dtos;
using Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

[ApiController]
[Route("api/delta")]
public class DataDeltaController(AppDbContext db) : ControllerBase
{
    [HttpPost("prices")]
    public async Task<IActionResult> DeltaPrices([FromBody] PriceTypeUploadDto dto)
    {
        var deltas = dto.ArrayOfPricesEl;
        if (deltas == null || deltas.Count == 0)
            return BadRequest("No price deltas provided");

        await using var transaction = await db.Database.BeginTransactionAsync();
        try
        {
            // загружаем все существующие цены по входящим ID, чтобы не делать N запросов
            var ids = deltas.Select(d => d.ID).ToHashSet();
            var existingPrices = await db.Prices
                .Where(p => ids.Contains(p.ID))
                .ToDictionaryAsync(p => p.ID);

            foreach (var delta in deltas)
            {
                if (existingPrices.TryGetValue(delta.ID, out var existing))
                {
                    // суммируем поля
                    existing.PriceT += delta.PriceT;
                    existing.PriceLimitT1 += delta.PriceLimitT1;
                    existing.PriceT1 += delta.PriceT1;
                    existing.PriceLimitT2 += delta.PriceLimitT2;
                    existing.PriceT2 += delta.PriceT2;
                    existing.PriceM += delta.PriceM;
                    existing.PriceLimitM1 += delta.PriceLimitM1;
                    existing.PriceM1 += delta.PriceM1;
                    existing.PriceLimitM2 += delta.PriceLimitM2;
                    existing.PriceM2 += delta.PriceM2;

                    // NDS заменяем, если он пришёл (он, вроде, не дельта)
                    existing.NDS = delta.NDS;
                }
                else
                {
                    // если нет такого id — создаём новую запись на основе дельты
                    var newPrice = new Price
                    {
                        ID = delta.ID,
                        IDStock = delta.IDStock,
                        PriceT = delta.PriceT,
                        PriceLimitT1 = delta.PriceLimitT1,
                        PriceT1 = delta.PriceT1,
                        PriceLimitT2 = delta.PriceLimitT2,
                        PriceT2 = delta.PriceT2,
                        PriceM = delta.PriceM,
                        PriceLimitM1 = delta.PriceLimitM1,
                        PriceM1 = delta.PriceM1,
                        PriceLimitM2 = delta.PriceLimitM2,
                        PriceM2 = delta.PriceM2,
                        NDS = delta.NDS
                    };
                    db.Prices.Add(newPrice);
                }
            }

            await db.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { updated = deltas.Count });
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
    public async Task<IActionResult> DeltaRemnants([FromBody] RemnantUploadDto dto)
    {
        var deltas = dto.ArrayOfRemnantsEl;
        if (deltas == null || deltas.Count == 0)
            return BadRequest("No remnant deltas provided");

        await using var transaction = await db.Database.BeginTransactionAsync();
        try
        {
            // загружаем все существующие цены по входящим ID, чтобы не делать N запросов
            var ids = deltas.Select(d => d.ID).ToHashSet();
            var existingRemnants = await db.Remnants
                .Where(r => ids.Contains(r.ID))
                .ToDictionaryAsync(r => r.ID);

            foreach (var delta in deltas)
            {
                if (existingRemnants.TryGetValue(delta.ID, out var existing))
                {
                    // суммируем поля
                    existing.InStockT += delta.InStockT;
                    existing.InStockM += delta.InStockM;
                    
                    // это не заменяем, если пришёло (оно, вроде, не дельта)
                    existing.AvgTubeLength = delta.AvgTubeLength;
                    existing.AvgTubeWeight = delta.AvgTubeWeight;
                }
                else
                {
                    // если нет такого id — создаём новую запись на основе дельты
                    var newRemnant = new Remnant
                    {
                        ID = delta.ID,
                        IDStock = delta.IDStock,
                        InStockT = delta.InStockT,
                        InStockM = delta.InStockM,
                        AvgTubeLength = delta.AvgTubeLength,
                        AvgTubeWeight = delta.AvgTubeWeight,
                    };
                    db.Remnants.Add(newRemnant);
                }
            }

            await db.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { updated = deltas.Count });
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