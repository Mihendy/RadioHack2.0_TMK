using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockController : ControllerBase
{
    private readonly AppDbContext _context;

    public StockController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/stock
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Stock>>> GetStocks()
    {
        return await _context.Stocks.ToListAsync();
    }

    // GET: api/stock/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Stock>> GetStock(string id)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null) return NotFound();
        return stock;
    }

    // // POST: api/stock
    // [HttpPost]
    // public async Task<ActionResult<Stock>> CreateStock(Stock stock)
    // {
    //     stock.IDStock = Guid.NewGuid(); // создаём уникальный ID
    //     _context.Stocks.Add(stock);
    //     await _context.SaveChangesAsync();
    //     return CreatedAtAction(nameof(GetStock), new { id = stock.IDStock }, stock);
    // }

    // PUT: api/stock/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStock(string id, Stock stock)
    {
        if (id != stock.IDStock) return BadRequest();

        _context.Entry(stock).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/stock/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStock(string id)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null) return NotFound();

        _context.Stocks.Remove(stock);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}