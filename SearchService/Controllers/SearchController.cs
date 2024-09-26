using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.RequestHelpers;

namespace SearchService.Controllers;

[ApiController]
[Route("/api/search")]
public class SearchController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Item>>> SearchItems([FromQuery] SearchParams searchParams)
    {
        var query = DB.PagedSearch<Item, Item>();

        if (!string.IsNullOrEmpty(searchParams.SearchTerm))
        {
            query.Match(Search.Full, searchParams.SearchTerm).SortByTextScore();
        }
        
        query = searchParams.OrderBy switch
        {
            "artist" => query.Sort(x => x.Ascending(f => f.Artist)),
            "new" => query.Sort(x => x.Descending(f => f.CreatedAt)),
            _ => query.Sort(x => x.Ascending(f => f.AuctionEnd))
        };

        query = searchParams.FilterBy switch
        {
            "finished" => query.Match(x => x.AuctionEnd < DateTime.UtcNow),
            "endingSoon" => query.Match(x =>
                x.AuctionEnd < DateTime.UtcNow.AddHours(6) && x.AuctionEnd > DateTime.UtcNow),
            _ => query.Match(x => x.AuctionEnd > DateTime.UtcNow)
        };

        if (!string.IsNullOrEmpty(searchParams.Seller)) query.Match(x => x.Seller == searchParams.Seller);
        if (!string.IsNullOrEmpty(searchParams.Winner)) query.Match(x => x.Winner == searchParams.Winner);
        
        query.PageNumber(searchParams.PageNumber);
        query.PageSize(searchParams.PageSize);
        
        var executeAsyncQuery = await query.ExecuteAsync();
        
        return Ok(new
        {
            results = executeAsyncQuery.Results,
            pageCount = executeAsyncQuery.PageCount,
            totalCount = executeAsyncQuery.TotalCount
        });
    }

    [HttpOptions]
    public async Task<ActionResult<List<Item>>> GetAuctionByUser([FromQuery] string user)
    {
        var query = await DB.Find<Item>()
            .Match(a => a.Seller == user || a.Winner == user)
            .ExecuteAsync();

        return Ok(query);
    }
    
}