using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace backend.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController(AppDbContext db) : ControllerBase
{
    // Helper to get Telegram user id from JWT claims
    private bool TryGetTgUserId(out long tgId)
    {
        tgId = 0;
        var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ?? User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(sub))
            return false;
        return long.TryParse(sub, out tgId);
    }

    // GET /api/cart
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetCart()
    {
        if (!TryGetTgUserId(out var tgId))
            return Unauthorized();

        var order = await db.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Nomenclature)
            .FirstOrDefaultAsync(o => o.TgUserID == tgId);

        if (order == null)
            return Ok(new { items = Array.Empty<object>() });

        return Ok(order);
    }

    // DTO for adding/updating items
    public class CartItemDto
    {
        public string NomenclatureID { get; set; } = string.Empty;
        public string StockID { get; set; } = string.Empty;
        public decimal QuantityInTons { get; set; }
        public decimal QuantityInMeters { get; set; }
    }

    // DTO for submitting order details
    public class SubmitOrderDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Inn { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    // POST /api/cart/items
    [HttpPost("items")]
    [Authorize]
    public async Task<IActionResult> AddItem([FromBody] CartItemDto dto)
    {
        if (!TryGetTgUserId(out var tgId))
            return Unauthorized();

        var order = await db.Orders.FirstOrDefaultAsync(o => o.TgUserID == tgId);
        if (order == null)
        {
            order = new Order { ID = Guid.NewGuid(), TgUserID = tgId };
            db.Orders.Add(order);
            await db.SaveChangesAsync();
        }

        var item = new OrderItem
        {
            ID = Guid.NewGuid(),
            OrderID = order.ID,
            NomenclatureID = dto.NomenclatureID,
            StockID = dto.StockID,
            QuantityInTons = dto.QuantityInTons,
            QuantityInMeters = dto.QuantityInMeters
        };

        db.OrderItems.Add(item);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCart), new { id = item.ID }, item);
    }

    // PUT /api/cart/items/{id}
    [HttpPut("items/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateItem(Guid id, [FromBody] CartItemDto dto)
    {
        if (!TryGetTgUserId(out var tgId))
            return Unauthorized();

        var item = await db.OrderItems
            .Include(i => i.Order)
            .FirstOrDefaultAsync(i => i.ID == id && i.Order!.TgUserID == tgId);

        if (item == null)
            return NotFound();

        item.QuantityInTons = dto.QuantityInTons;
        item.QuantityInMeters = dto.QuantityInMeters;
        item.NomenclatureID = dto.NomenclatureID;
        item.StockID = dto.StockID;

        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/cart/items/{id}
    [HttpDelete("items/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteItem(Guid id)
    {
        if (!TryGetTgUserId(out var tgId))
            return Unauthorized();

        var item = await db.OrderItems
            .Include(i => i.Order)
            .FirstOrDefaultAsync(i => i.ID == id && i.Order!.TgUserID == tgId);

        if (item == null)
            return NotFound();

        db.OrderItems.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/cart (clear cart)
    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> ClearCart()
    {
        if (!TryGetTgUserId(out var tgId))
            return Unauthorized();

        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.TgUserID == tgId);

        if (order == null)
            return NoContent();

        db.OrderItems.RemoveRange(order.Items);
        db.Orders.Remove(order);
        await db.SaveChangesAsync();

        return NoContent();
    }

    // POST /api/cart/submit - submit order details (address, inn, phone, etc.)
    [HttpPost("submit")]
    [Authorize]
    public async Task<IActionResult> SubmitOrder([FromBody] SubmitOrderDto dto)
    {
        if (!TryGetTgUserId(out var tgId))
            return Unauthorized();

        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.TgUserID == tgId);

        if (order == null)
            return BadRequest("Cart is empty or order not found.");

        order.FirstName = dto.FirstName;
        order.LastName = dto.LastName;
        order.Inn = dto.Inn;
        order.Phone = dto.Phone;
        order.Email = dto.Email;

        await db.SaveChangesAsync();

        return Ok(new { message = "Order submitted", orderId = order.ID });
    }


    [HttpGet("total/{orderId}")]
    [Authorize]
    public async Task<IActionResult> GetOrderTotal(Guid orderId, [FromQuery] string? metric)
    {
        if (!TryGetTgUserId(out var tgId))
            return Unauthorized();

        if (string.IsNullOrEmpty(metric))
            return BadRequest("Query parameter 'metric' is required and must be 'weight' or 'length'.");

        var metricNorm = metric.Trim().ToLowerInvariant();
        if (metricNorm != "weight" && metricNorm != "length")
            return BadRequest("Query parameter 'metric' must be either 'weight' or 'length'.");

        var order = await db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.ID == orderId && o.TgUserID == tgId);

        if (order == null)
            return NotFound();

        decimal totalWithDiscount = 0m;
        decimal totalWithoutDiscount = 0m;

            var priceKeys = order.Items
                .Select(i => new { Id = i.NomenclatureID, Stock = i.StockID })
                .Distinct()
                .ToList();

            // EF Core cannot translate .Any(...) over an in-memory collection inside a Where.
            // Build lists of ids and stocks and query using Contains which is translatable, then match pairs in-memory.
            var ids = priceKeys.Select(k => k.Id).Distinct().ToList();
            var stocks = priceKeys.Select(k => k.Stock).Distinct().ToList();

            var prices = await db.Prices
                .Where(p => ids.Contains(p.ID) && stocks.Contains(p.IDStock))
                .ToListAsync();
            
            foreach (var item in order.Items)
            {
                var price = prices.FirstOrDefault(p => p.ID == item.NomenclatureID && p.IDStock == item.StockID);
                if (price == null)
                    continue;

                if (metricNorm == "weight")
                {
                    var compare = item.QuantityInTons;
                    decimal baseUnit = price.PriceT;
                    decimal unit = baseUnit;
                    if (price.PriceLimitT2 > 0 && compare >= price.PriceLimitT2)
                        unit = price.PriceT2;
                    else if (price.PriceLimitT1 > 0 && compare >= price.PriceLimitT1)
                        unit = price.PriceT1;

                    decimal baseSumForItem = baseUnit * item.QuantityInTons;
                    decimal discountedSumForItem = unit * item.QuantityInTons;

                    decimal ndsFactor = 1m;
                    if (price.NDS > 0)
                        ndsFactor += price.NDS / 100m;

                    baseSumForItem *= ndsFactor;
                    discountedSumForItem *= ndsFactor;

                    totalWithoutDiscount += baseSumForItem;
                    totalWithDiscount += discountedSumForItem;
                }
                else // length
                {
                    var compare = item.QuantityInMeters;
                    decimal baseUnit = price.PriceM;
                    decimal unit = baseUnit;
                    if (price.PriceLimitM2 > 0 && compare >= price.PriceLimitM2)
                        unit = price.PriceM2;
                    else if (price.PriceLimitM1 > 0 && compare >= price.PriceLimitM1)
                        unit = price.PriceM1;

                    decimal baseSumForItem = baseUnit * item.QuantityInMeters;
                    decimal discountedSumForItem = unit * item.QuantityInMeters;

                    totalWithoutDiscount += baseSumForItem;
                    totalWithDiscount += discountedSumForItem;
                }
            }

        return Ok(new { orderId = order.ID, totalWithoutDiscount, totalWithDiscount });
    }
}
