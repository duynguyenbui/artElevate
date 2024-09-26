using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer(IMapper mapper) : IConsumer<AuctionUpdated>
{
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        Console.WriteLine($"AuctionUpdatedConsumer:::Consuming auction updated:::{context.Message}");
        var item = mapper.Map<Item>(context.Message);
        var result = await DB.Update<Item>()
            .Match(a => a.ID == context.Message.Id)
            .ModifyOnly(x => new
            {
                x.Artist,
                x.Name,
                x.Description,
                x.Height,
                x.Width,
                x.Medium,
                x.Year,
                x.ReservePrice,
                x.AuctionEnd
            }, item).ExecuteAsync();
        if (!result.IsAcknowledged)
        {
            throw new MessageException(typeof(AuctionUpdated), "Problem updating mongodb");
        }
    }
}