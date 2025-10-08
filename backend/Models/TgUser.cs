using System.Text.Json.Serialization;

// Модель для данных о пользователе
namespace backend.Models;

public class TgUser
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("first_name")]
    public string FirstName { get; set; }

    [JsonPropertyName("username")]
    public string Username { get; set; }
    
}