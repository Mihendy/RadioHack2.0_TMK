using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api")]
public class DataFrontController(AppDbContext db) : ControllerBase
{
    
    /// <summary>
    /// Возвращает список всех типов труб из каталога.
    /// </summary>
    [HttpGet("pipe-types")]
    public async Task<IActionResult> GetPipeTypes()
    {
        return Ok(await db.PipeTypes.ToListAsync());
    }
    /// <summary>
    /// Получить список всех складов.
    /// </summary>
    [HttpGet("warehouses")]
    public async Task<IActionResult> GetWarehouses()
    {
        var warehouses = await db.Stocks.ToListAsync();
        return Ok(warehouses);
    }

    /// <summary>
    /// Получить список всех ГОСТов.
    /// </summary>
    [HttpGet("gost")]
    public async Task<IActionResult> GetGosts()
    {
        var gosts = await db.Nomenclatures
            .Select(n => n.Gost)
            .Where(g => !string.IsNullOrEmpty(g))
            .Distinct()
            .ToListAsync();
        return Ok(gosts);
    }

    /// <summary>
    /// Получить список всех марок стали.
    /// </summary>
    [HttpGet("steel-grades")]
    public async Task<IActionResult> GetSteelGrades()
    {
        var grades = await db.Nomenclatures
            .Select(n => n.SteelGrade)
            .Where(g => !string.IsNullOrEmpty(g))
            .Distinct()
            .ToListAsync();
        return Ok(grades);
    }

    /// <summary>
    /// Получение списка всех продуктов с фильтрацией и сортировкой.
    /// </summary>
    /// <remarks>
    /// Этот эндпоинт позволяет получить полный список продукции с возможностью фильтрации и сортировки.  
    /// 
    /// **Фильтры (Query Parameters):**
    /// - `warehouse` (string) — ID склада для фильтрации по остаткам (`Remnants`).
    /// - `productType` (string) — фильтрация по типу трубы (PipeType.Type).
    /// - `diameterMin` (double) — минимальный диаметр трубы.
    /// - `diameterMax` (double) — максимальный диаметр трубы.
    /// - `thicknessMin` (double) — минимальная толщина стенки трубы.
    /// - `thicknessMax` (double) — максимальная толщина стенки трубы.
    /// - `gost` (string) — фильтрация по ГОСТ.
    /// - `steelGrade` (string) — фильтрация по марке стали.
    /// - `search` (string) — текстовый поиск по названию продукции.
    ///
    /// **Сортировка (sortBy):**
    /// - `diameter` — по возрастанию диаметра
    /// - `diameter_desc` — по убыванию диаметра
    /// - `thickness` — по возрастанию толщины стенки
    /// - `thickness_desc` — по убыванию толщины стенки
    /// - `name` — по алфавиту по названию
    /// - `name_desc` — по алфавиту в обратном порядке
    /// </remarks>
    [HttpGet("products")]
    public async Task<IActionResult> GetProducts(
        [FromQuery] string? warehouse,
        [FromQuery] string? productType,
        [FromQuery] double? diameterMin,
        [FromQuery] double? diameterMax,
        [FromQuery] double? thicknessMin,
        [FromQuery] double? thicknessMax,
        [FromQuery] string? gost,
        [FromQuery] string? steelGrade,
        [FromQuery] string? search,
        [FromQuery] string? sortBy)
    {
        var query = db.Nomenclatures
            .Include(n => n.PipeType)
            .Include(n => n.Prices)
            .Include(n => n.Remnants)
            .AsQueryable();

        if (!string.IsNullOrEmpty(productType))
            query = query.Where(n => n.PipeType != null && n.PipeType.Type == productType);
        if (!string.IsNullOrEmpty(gost))
            query = query.Where(n => n.Gost == gost);
        if (!string.IsNullOrEmpty(steelGrade))
            query = query.Where(n => n.SteelGrade == steelGrade);
        if (diameterMin.HasValue)
            query = query.Where(n => n.Diameter >= diameterMin.Value);
        if (diameterMax.HasValue)
            query = query.Where(n => n.Diameter <= diameterMax.Value);
        if (thicknessMin.HasValue)
            query = query.Where(n => n.PipeWallThickness >= thicknessMin.Value);
        if (thicknessMax.HasValue)
            query = query.Where(n => n.PipeWallThickness <= thicknessMax.Value);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(n => n.Name.Contains(search));
        // warehouse фильтрация по складу через Remnants
        if (!string.IsNullOrEmpty(warehouse))
            query = query.Where(n => n.Remnants.Any(r => r.IDStock == warehouse));

        // Сортировка
        if (!string.IsNullOrEmpty(sortBy))
        {
            query = sortBy switch
            {
                "diameter" => query.OrderBy(n => n.Diameter),
                "diameter_desc" => query.OrderByDescending(n => n.Diameter),
                "thickness" => query.OrderBy(n => n.PipeWallThickness),
                "thickness_desc" => query.OrderByDescending(n => n.PipeWallThickness),
                "name" => query.OrderBy(n => n.Name),
                "name_desc" => query.OrderByDescending(n => n.Name),
                _ => query
            };
        }

        var products = await query.ToListAsync();
        return Ok(products);
    }

    /// <summary>
    /// Получение детальной информации о продукте по ID.
    /// </summary>
    [HttpGet("products/{id}")]
    public async Task<IActionResult> GetProductById(string id)
    {
        var product = await db.Nomenclatures
            .Include(n => n.PipeType)
            .Include(n => n.Prices)
            .Include(n => n.Remnants)
            .FirstOrDefaultAsync(n => n.ID == id);
        if (product == null)
            return NotFound();
        return Ok(product);
    }

    /// <summary>
    /// Получение диапазонов значений для фильтров (мин/макс диаметр, толщина).
    /// </summary>
    [HttpGet("products/ranges")]
    public async Task<IActionResult> GetProductRanges()
    {
        var minDiameter = await db.Nomenclatures.MinAsync(n => n.Diameter);
        var maxDiameter = await db.Nomenclatures.MaxAsync(n => n.Diameter);
        var minThickness = await db.Nomenclatures.MinAsync(n => n.PipeWallThickness);
        var maxThickness = await db.Nomenclatures.MaxAsync(n => n.PipeWallThickness);
        return Ok(new {
            diameter = new { min = minDiameter, max = maxDiameter },
            thickness = new { min = minThickness, max = maxThickness }
        });
    }

    

}

