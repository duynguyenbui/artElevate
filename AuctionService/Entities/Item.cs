using System.ComponentModel.DataAnnotations.Schema;
namespace AuctionService.Entities;

[Table("Items")]
public class Item
{
    public Guid Id { get; set; }
    public string Artist { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public double Height { get; set; }
    public double Width { get; set; }
    public string Medium { get; set; }
    public int Year { get; set; }
    public List<string> ImageUrl { get; set; } = new();
    // Navigation properties
    public Guid AuctionId { get; set; }
    public Auction Auction { get; set; }
}