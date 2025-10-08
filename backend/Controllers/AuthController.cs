using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(TelegramInitDataValidator validator, JwtTokenService tokenService) : ControllerBase
{
    [HttpPost("telegram")]
    public IActionResult Authenticate([FromBody] AuthRequest request)
    {
        if (string.IsNullOrEmpty(request.InitData))
            return BadRequest("Init data is required.");

        if (!validator.Validate(request.InitData, out var validatedData))
            return Unauthorized("Invalid Telegram Init Data hash.");


        var tgId = validatedData!.User?.Id;

        if (!tgId.HasValue)
            return Unauthorized("User ID not available in validated data.");


        var userToken = tokenService.GenerateToken(tgId.Value);

        return Ok(new 
        {
            message = "Authentication successful",
            token = userToken,
            userId = tgId.Value
        });

    }
    
}