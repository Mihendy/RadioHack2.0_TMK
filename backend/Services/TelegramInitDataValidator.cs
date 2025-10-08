using System.Security.Cryptography;
using System.Text;
using System.Web;
using backend.Models;

namespace backend.Services;

public class TelegramInitDataValidator
{
    private readonly string _botToken;
    private const string WebAppDataConstant = "WebAppData";

    public TelegramInitDataValidator(string botToken)
    {
        _botToken = botToken ?? throw new ArgumentNullException(nameof(botToken));
    }

    public bool Validate(string initData, out InitData? data)
    {
        data = null;
        var parameters = HttpUtility.ParseQueryString(initData);
        var hash = parameters["hash"];
        if (string.IsNullOrEmpty(hash))
        {
            return false;
        }

        // 1. Создание строки для проверки
        var dataCheckString = new StringBuilder();
        var keys = parameters.AllKeys.Where(k => k != "hash").OrderBy(k => k).ToList();

        foreach (var key in keys)
        {
            if (dataCheckString.Length > 0)
            {
                dataCheckString.Append('\n');
            }
            // Декодируем значение, так как оно может содержать JSON (например, user)
            dataCheckString.Append($"{key}={HttpUtility.UrlDecode(parameters[key])}");
        }

        // 2. Создание секретного ключа (Secret Key)
        using var hmacSha256 = new HMACSHA256(Encoding.UTF8.GetBytes(WebAppDataConstant));
        var secretKey = hmacSha256.ComputeHash(Encoding.UTF8.GetBytes(_botToken));

        // 3. Вычисление и сравнение хэша (Data Check Hash)
        using var dataCheckHash = new HMACSHA256(secretKey);
        var computedHashBytes = dataCheckHash.ComputeHash(Encoding.UTF8.GetBytes(dataCheckString.ToString()));
        var computedHash = BitConverter.ToString(computedHashBytes).Replace("-", "").ToLowerInvariant();

        if (!computedHash.Equals(hash, StringComparison.OrdinalIgnoreCase)) return false;

        data = new InitData(parameters);
        return true;

    }
}