namespace Contracts;

public class AuctionCreated
{
    // Auction information
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime AuctionEnd { get; set; }
    public string Seller { get; set; }
    public string Winner { get; set; }
    public string Status { get; set; }
    public int ReservePrice { get; set; }
    public int? SoldAmount { get; set; }
    public int? CurrentHighBid { get; set; }

    // Artwork information
    public string Artist { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public double Height { get; set; }
    public double Width { get; set; }
    public string Medium { get; set; }
    public int Year { get; set; }
    public List<string> ImageUrl { get; set; }
}