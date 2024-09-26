using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Repositories;

public class AuctionRepository
(
    AuctionDbContext dbContext,
    IMapper mapper
) : IAuctionRepository
{
    public async Task<List<AuctionDto>> GetAuctionsAsync(string date)
    {
        var query = dbContext.Auctions
            .OrderBy(x => x.Item.Artist).AsQueryable();
        if (!string.IsNullOrEmpty(date))
            query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
        return await query.ProjectTo<AuctionDto>(mapper.ConfigurationProvider).ToListAsync();   

    }

    public async Task<AuctionDto> GetAuctionByIdAsync(Guid id)
    {
        return await dbContext.Auctions
            .ProjectTo<AuctionDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Id == id);

    }

    public async Task<Auction> GetAuctionEntityByIdAsync(Guid id)
    {
        return await dbContext.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public void AddAuction(Auction auction)
    {
        dbContext.Auctions.Add(auction);
    }

    public void RemoveAuction(Auction auction)
    {
        dbContext.Auctions.Remove(auction);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await dbContext.SaveChangesAsync() > 0;
    }
}