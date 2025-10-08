namespace backend.Services
{
    public interface ITokenService
    {
        string GenerateToken(long userId);
    }
}
