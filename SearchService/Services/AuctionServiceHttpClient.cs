using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Services;

public class AuctionServiceHttpClient(HttpClient httpClient, IConfiguration configuration)
{
    public async Task<List<Item>> GetItemsForSearchDb()
    {
        var lastUpdated = await DB.Find<Item, string>()
            .Sort(x => x.Descending(item => item.UpdatedAt))
            .Project(x => x.UpdatedAt.ToString())
            .ExecuteFirstAsync();

        return await httpClient.GetFromJsonAsync<List<Item>>(configuration["AuctionServiceUrl"] + "/api/auctions?date=" + lastUpdated);
    }
}