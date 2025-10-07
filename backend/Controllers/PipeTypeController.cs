using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PipeTypeController : ControllerBase
{
    private readonly AppDbContext _context;

    public PipeTypeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PipeType>>> GetPipeTypes()
    {
        return await _context.PipeTypes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PipeType>> GetPipeType(string id)
    {
        var pipeType = await _context.PipeTypes.FindAsync(id);
        if (pipeType == null) return NotFound();
        return pipeType;
    }

    // [HttpPost]
    // public async Task<ActionResult<PipeType>> CreatePipeType(PipeType pipeType)
    // {
    //     pipeType.IDType = Guid.NewGuid();
    //     _context.PipeTypes.Add(pipeType);
    //     await _context.SaveChangesAsync();
    //     return CreatedAtAction(nameof(GetPipeType), new { id = pipeType.IDType }, pipeType);
    // }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePipeType(string id, PipeType pipeType)
    {
        if (id != pipeType.IDType) return BadRequest();

        _context.Entry(pipeType).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePipeType(string id)
    {
        var pipeType = await _context.PipeTypes.FindAsync(id);
        if (pipeType == null) return NotFound();

        _context.PipeTypes.Remove(pipeType);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
