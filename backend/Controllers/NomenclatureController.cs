using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NomenclatureController : ControllerBase
{
    private readonly AppDbContext _context;

    public NomenclatureController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Nomenclature>>> GetNomenclatures()
    {
        return await _context.Nomenclatures
            .Include(n => n.PipeType) // включаем связь с PipeType
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Nomenclature>> GetNomenclature(string id)
    {
        var nom = await _context.Nomenclatures
            .Include(n => n.PipeType)
            .FirstOrDefaultAsync(n => n.ID == id);

        if (nom == null) return NotFound();
        return nom;
    }

    // [HttpPost]
    // public async Task<ActionResult<Nomenclature>> CreateNomenclature(Nomenclature nom)
    // {
    //     nom.ID = Guid.NewGuid();
    //     _context.Nomenclatures.Add(nom);
    //     await _context.SaveChangesAsync();
    //     return CreatedAtAction(nameof(GetNomenclature), new { id = nom.ID }, nom);
    // }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNomenclature(string id, Nomenclature nom)
    {
        if (id != nom.ID) return BadRequest();

        _context.Entry(nom).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNomenclature(string id)
    {
        var nom = await _context.Nomenclatures.FindAsync(id);
        if (nom == null) return NotFound();

        _context.Nomenclatures.Remove(nom);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
