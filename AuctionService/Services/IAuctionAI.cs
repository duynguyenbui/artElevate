namespace AuctionService.Services;

public interface IAuctionAI
{
    Task<string> GetPredictPriceAuction(Guid auctionId);
}