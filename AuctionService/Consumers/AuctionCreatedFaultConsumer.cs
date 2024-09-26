using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionCreatedFaultConsumer : IConsumer<Fault<AuctionCreated>>
{
    public async Task Consume(ConsumeContext<Fault<AuctionCreated>> context)
    {
        Console.WriteLine($"AuctionCreatedFaultConsumer:::Consuming auction created fault:::{context.Message.FaultId}");
        var exception = context.Message.Exceptions.First();
        if (exception.ExceptionType == "System.ArgumentException")
        {
            context.Message.Message.Name = "FooBar";
            await context.Publish(context.Message.Message);
        }
        else
        {
            Console.WriteLine("ERROR:::Not an argument exception - update dashboard error somewhere");
        }
    }
}