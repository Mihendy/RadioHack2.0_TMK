using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Order
{
    [Key]
    public Guid ID { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Inn { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public List<OrderItem> Items { get; set; } = [];
}