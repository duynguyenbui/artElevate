using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.IntegrationTests.Fixtures;
using AuctionService.IntegrationTests.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace AuctionService.IntegrationTests;

public class AuctionControllerTests(WebAppFactory factory) : IClassFixture<WebAppFactory>, IAsyncLifetime
{
    private readonly HttpClient _httpClient = factory.CreateClient();
    private const string GUID = "afbee524-5972-4075-8800-7d1f9d7b0a0c";

    [Fact]
    public async Task GetAuctions_ShouldReturns3Auctions()
    {
        // Arrange => Do nothing
        // Action
        var response = await _httpClient
            .GetFromJsonAsync<List<AuctionDto>>("/api/auctions");
        // Assert
        Assert.Equal(3, response.Count);
    }
    
    [Fact]
    public async Task GetAuctionById_WithValidId_ShouldReturnsAuction()
    {
        // Arrange => Do nothing
        // Action
        var response = await _httpClient
            .GetFromJsonAsync<AuctionDto>($"/api/auctions/{GUID}");
        // Assert
        Assert.Equal("Mona Lisa", response.Name);
    }
    
    [Fact]
    public async Task GetAuctionById_WithInvalidId_ShouldReturns404NotFound()
    {
        // Arrange => Do nothing
        // Action
        var response = await _httpClient
            .GetAsync($"/api/auctions/{Guid.NewGuid()}");
        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
    
    [Fact]
    public async Task GetAuctionById_WithInvalidGuid_ShouldReturns400BadRequest()
    {
        // Arrange => Do nothing
        // Action
        var response = await _httpClient
            .GetAsync("/api/auctions/notaguid");
        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
    
    [Fact]
    public async Task CreateAuction_WithNoAuthentication_ShouldReturns401Unauthorized()
    {
        // Arrange => Do nothing
        var auction = new CreateAuctionDto { Name = "Duy Nguyen Bui" };
        // Action
        var response = await _httpClient.PostAsJsonAsync("/api/auctions", auction);
        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
    // ================================================================================================= 
    // [Fact]
    // public async Task CreateAuction_WithAuthentication_ShouldReturns201Created()
    // {
    //     // Arrange
    //     var auction = GetAuctionForCreate();
    //     
    //     var content = new MultipartFormDataContent();
    //     content.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data");
    //     content.Add(new StringContent(auction.Artist), "Artist");
    //     content.Add(new StringContent(auction.Name), "Name");
    //     content.Add(new StringContent(auction.Description), "Description");
    //     content.Add(new StringContent(auction.Height.ToString()), "Height");
    //     content.Add(new StringContent(auction.Width.ToString()), "Width");
    //     content.Add(new StringContent(auction.Medium), "Medium");
    //     content.Add(new StringContent(auction.Year.ToString()), "Year");
    //     content.Add(new StringContent(auction.ReservePrice.ToString()), "ReservePrice");
    //     content.Add(new StringContent(auction.AuctionEnd.ToString()), "AuctionEnd");
    //     
    //     _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));
    //     // Action
    //     var response = await _httpClient.PostAsync("/api/auctions", content);
    //     // Assert
    //     Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    // }
    // =================================================================================================

    [Fact]
    public async Task CreateAuction_WithInvalidCreateAuctionDto_ShouldReturn400()
    {
        // arrange? 
        var auction = GetAuctionForCreate();
        auction.Name = null;
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

        // act
        var response = await _httpClient.PostAsJsonAsync($"api/auctions", auction);

        // assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateAuction_WithValidUpdateDtoAndUser_ShouldReturn200()
    {
        // arrange? 
        var updateAuction = new UpdateAuctionDto { Name = "Updated" };
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("bob"));

        // act
        var response = await _httpClient.PatchAsJsonAsync($"api/auctions/{GUID}", updateAuction);

        // assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task UpdateAuction_WithValidUpdateDtoAndInvalidUser_ShouldReturn403()
    {
        // arrange? 
        var updateAuction = new UpdateAuctionDto { Name = "Updated" };
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser("notbob"));

        // act
        var response = await _httpClient.PatchAsJsonAsync($"api/auctions/{GUID}", updateAuction);

        // assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
    
    
    public Task InitializeAsync() => Task.CompletedTask;

    public Task DisposeAsync()
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AuctionDbContext>();
        DbHelper.ReInitDbForTests(db);
        return Task.CompletedTask;
    }

    private CreateAuctionDto GetAuctionForCreate()
    {
        return new CreateAuctionDto
        {
            Artist = "test artist",
            Name = "test name",
            Description = "test description",
            Height = 170,
            Width = 150,
            Medium = "test medium",
            Year = 1506,
            Files = null,
            ReservePrice = 1,
            AuctionEnd = DateTime.Now.AddHours(1)
        };
    }
}