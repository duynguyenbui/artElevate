using AuctionService;
using BiddingService.Models;
using Grpc.Net.Client;

namespace BiddingService.Services;

public class GrpcAuctionClient(ILogger<GrpcAuctionClient> logger, IConfiguration configuration)
{
    public Auction GetAuction(string id)
    {
        logger.LogInformation(":::Calling Grpc Services:::GetAuction");
        var channel = GrpcChannel.ForAddress(configuration["GrpcAuction"]);
        var client = new GrpcAuction.GrpcAuctionClient(channel);
        var request = new GetAuctionRequest { Id = id, };

        try
        {
            var reply = client.GetAuction(request);
            var auction = new Auction
            {
                ID = reply.Auction.Id,
                AuctionEnd = DateTime.Parse(reply.Auction.AuctionEnd),
                Seller = reply.Auction.Seller,
                ReservePrice = reply.Auction.ReservePrice
            };

            return auction;
        }
        catch (Exception e)
        {
            logger.LogError(e, $":::Could not call Grpc Server:::{configuration["GrpcAuction"]}");
            return null;
        }
    }
}