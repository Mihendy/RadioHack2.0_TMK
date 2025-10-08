using System.Collections.Specialized;
using System.Text.Json;

namespace backend.Models;

public class InitData
{
    public TgUser User { get; }
    public long AuthDate { get; }
    
    public InitData(NameValueCollection parameters)
    {
        if (long.TryParse(parameters["auth_date"], out var date))
        {
            AuthDate = date;
        }

        var userJson = parameters["user"];
        if (!string.IsNullOrEmpty(userJson))
        {
            User = JsonSerializer.Deserialize<TgUser>(userJson);
        }
    }
}
