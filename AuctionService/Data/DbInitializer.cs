using AuctionService.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class DbInitializer
{
    public static async Task InitDatabase(WebApplication application)
    {
        using var scope = application.Services.CreateScope();
        await SeedData(scope.ServiceProvider.GetRequiredService<AuctionDbContext>());
    }

    private static async Task SeedData(AuctionDbContext context)
    {
        await context.Database.MigrateAsync();

        if (context.Auctions.Any())
        {
            Console.WriteLine("Database in already initialized");
            return;
        }

        var auctions = new List<Auction>
        {
            // 1. Mona Lisa
            new()
            {
                Id = Guid.Parse("afbee524-5972-4075-8800-7d1f9d7b0a0c"),
                Status = Status.Live,
                ReservePrice = 2,
                Seller = "bob",
                AuctionEnd = DateTime.UtcNow.AddDays(10),
                Item = new Item
                {
                    Artist = "Leonardo da Vinci",
                    Name = "Mona Lisa",
                    Description =
                        "\"Mona Lisa\" by Leonardo da Vinci, known for its enigmatic smile, is showcased at the Louvre Museum in Paris.",
                    Height = 170,
                    Width = 150,
                    Medium = "Oil on canvas",
                    Year = 1506,
                    ImageUrl = new List<string>()
                    {
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703913813/bcaacwke87hebvodoasa.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703913813/g7wzceqstqklcqrpqkxw.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703913813/macpbmjpgn8ioe2srsf7.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703913813/y0gczywd6maobuzhgezo.jpg"
                    }
                }
            },
            // 2. Starry Night
            new()
            {
                Id = Guid.Parse("c8c3ec17-01bf-49db-82aa-1ef80b833a9f"),
                Status = Status.Live,
                ReservePrice = 3,
                Seller = "alice",
                AuctionEnd = DateTime.UtcNow.AddDays(15),
                Item = new Item
                {
                    Artist = "Vincent van Gogh",
                    Name = "Starry Night",
                    Description =
                        "\"Starry Night\" by Vincent van Gogh, renowned for its vibrant colors, is a masterpiece in art history.",
                    Height = 140,
                    Width = 160,
                    Medium = "Oil on canvas",
                    Year = 1889,
                    ImageUrl =
                    [
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803970/oijo6dqzqo5txf5fbupx.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803970/rvwwgmmaojkjj2slbt4l.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803970/lvjjrcstimo7repnptbw.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803970/t3npkhw8cn0en8jzaarn.jpg"
                    ]
                }
            },
            // 3. Guernica
            new()
            {
                Id = Guid.Parse("155225c1-4448-4066-9886-6786536e05ea"),
                Status = Status.Live,
                ReservePrice = 5,
                Seller = "alice",
                AuctionEnd = DateTime.UtcNow.AddDays(25),
                Item = new Item
                {
                    Artist = "Pablo Picasso",
                    Name = "Guernica",
                    Description =
                        "\"Guernica\" by Pablo Picasso is a powerful anti-war painting depicting the horrors of the Spanish Civil War.",
                    Height = 150,
                    Width = 170,
                    Medium = "Oil on canvas",
                    Year = 1937,
                    ImageUrl = new List<string>()
                    {
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803915/uciv4jjcyinm2tx8mgyv.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803914/qv6bsrl917mkxf9beiq3.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803915/nbkadvjemn2gttyxd5pv.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803915/kfqovhznmuokhu2s9cnd.jpg"
                    }
                }
            },
            // 4. The Starry Night
            new()
            {
                Id = Guid.Parse("466e4744-4dc5-4987-aae0-b621acfc5e39"),
                Status = Status.Live,
                ReservePrice = 4,
                Seller = "bob",
                AuctionEnd = DateTime.UtcNow.AddDays(1),
                Item = new Item
                {
                    Artist = "Edvard Munch",
                    Name = "The Scream",
                    Description =
                        "\"The Scream\" by Edvard Munch is an iconic expressionist painting depicting existential angst.",
                    Height = 120,
                    Width = 150,
                    Medium = "Oil on canvas",
                    Year = 1893,
                    ImageUrl =
                    [
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702814046/ljmlylgfdf6svmvac3pe.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702814046/l2wfi4fijgu8agoxqppa.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702814046/npi9lg3vvbjhasgojhoj.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702814046/h1leto8ktjz1vl1ddxi5.jpg"
                    ]
                }
            },
            new()
            {
                Id = Guid.Parse("67e81bc8-d0a2-43f7-bf23-96e0b2d16d2d"),
                Status = Status.Live,
                ReservePrice = 6,
                Seller = "tom",
                AuctionEnd = DateTime.UtcNow.AddDays(4),
                Item = new Item
                {
                    Artist = "Claude Monet",
                    Name = "Water Lilies",
                    Description = "Water Lilies is a series of approximately 250 oil paintings by Claude Monet.",
                    Height = 89,
                    Width = 93,
                    Medium = "Oil on canvas",
                    Year = 1919,
                    ImageUrl =
                    [
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135543/zqhnfbyamhgdmekpn4yr.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135543/wuvo0r0ehgzqi0avif8p.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135543/ue22cqssovvdo4icbmpt.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135542/qbwqsoygfj0fr0ys4xuu.jpg"
                    ]
                }
            },
            new()
            {
                Id = Guid.Parse("836c6d87-0c3c-47ea-b9f0-4e9f1562f22b"),
                Status = Status.Live,
                ReservePrice = 7,
                Seller = "alice",
                AuctionEnd = DateTime.UtcNow.AddDays(5),
                Item = new Item
                {
                    Artist = "Jackson Pollock",
                    Name = "No. 5, 1948",
                    Description =
                        "No. 5, 1948 is a painting by Jackson Pollock, known for his unique style of drip painting.",
                    Height = 243,
                    Width = 152,
                    Medium = "Oil, enamel, and aluminum on fiberboard",
                    Year = 1948,
                    ImageUrl =
                    [
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135648/s7bu3gi6r2ejki5ljq6i.jpg"
                    ]
                }
            },
            new()
            {
                Id = Guid.Parse("e2f933bf-d97c-4c9d-8234-fbdfb12784c7"),
                Status = Status.Live,
                ReservePrice = 8,
                Seller = "tom",
                AuctionEnd = DateTime.UtcNow.AddDays(1),
                Item = new Item
                {
                    Artist = "Salvador Dalí",
                    Name = "The Persistence of Memory",
                    Description =
                        "The Persistence of Memory is a surrealistic painting by Salvador Dalí, featuring melting clocks.",
                    Height = 24,
                    Width = 33,
                    Medium = "Oil on canvas",
                    Year = 1931,
                    ImageUrl =
                    [
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135747/vnnvv9zhknsftznwz79t.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135747/x5by4ehppmqzgbr61364.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135746/mt5n1yy2wlzvsgi1kl79.jpg"
                    ]
                }
            }
        };

        await context.AddRangeAsync(auctions);
        await context.SaveChangesAsync();
    }
}