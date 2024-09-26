using AuctionService.Data;
using AuctionService.Entities;

namespace AuctionService.IntegrationTests.Utils;

public static class DbHelper
{
    public static void InitDbForTests(AuctionDbContext db)
    {
        db.Auctions.AddRange(GetAuctionsForTests());
        db.SaveChanges();
    }

    public static void ReInitDbForTests(AuctionDbContext db)
    {
        db.Auctions.RemoveRange(db.Auctions);
        db.SaveChanges();
        InitDbForTests(db);
    }

    private static List<Auction> GetAuctionsForTests()
    {
        return new List<Auction>()
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
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135151/xp8zkzd6nv99uxr6p3lo.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135151/u8ne0dkumurr1brwldta.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135151/wnwtqx2xjhlfpi9ujxnd.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1703135151/sxadknodmvnet4krxugp.jpg"
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
                    ImageUrl = new List<string>()
                    {
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803970/oijo6dqzqo5txf5fbupx.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803970/rvwwgmmaojkjj2slbt4l.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803970/lvjjrcstimo7repnptbw.jpg",
                        "https://res.cloudinary.com/dsceyl414/image/upload/v1702803970/t3npkhw8cn0en8jzaarn.jpg"
                    }
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
            }
        };
    }
}