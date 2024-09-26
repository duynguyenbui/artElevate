using AuctionService.Controllers;
using AuctionService.DTOs;
using AuctionService.Entities;
using AuctionService.Repositories;
using AuctionService.RequestHelpers;
using AuctionService.Services;
using AuctionService.UnitTests.Utils;
using AutoFixture;
using AutoMapper;
using CloudinaryDotNet.Actions;
using MassTransit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using AutoFixture.AutoMoq;
using UpdateAuctionDto = AuctionService.DTOs.UpdateAuctionDto;

namespace AuctionService.UnitTests;

public class AuctionControllerTests
{
    private readonly Mock<IAuctionRepository> _auctionRepository;
    private readonly Mock<IPublishEndpoint> _publishEndpoint;
    private readonly Mock<IImageService<ImageUploadResult, DeletionResult>> _imageService;
    private readonly IFixture _fixture;
    private readonly AuctionsController _auctionsController;
    private readonly IMapper _mapper;
    private readonly Mock<IAuctionAI> _auctionAi;

    public AuctionControllerTests()
    {
        _fixture = new Fixture().Customize(new AutoMoqCustomization());
        _auctionRepository = new Mock<IAuctionRepository>();
        _auctionAi = new Mock<IAuctionAI>();
        _publishEndpoint = new Mock<IPublishEndpoint>();
        _imageService = new Mock<IImageService<ImageUploadResult, DeletionResult>>();

        var mockMapper = new MapperConfiguration(mc => { mc.AddMaps(typeof(MappingProfiles).Assembly); }).CreateMapper()
            .ConfigurationProvider;

        _mapper = new Mapper(mockMapper);

        _auctionsController = new AuctionsController
        (
            _auctionRepository.Object,
            _auctionAi.Object,
            _mapper,
            _imageService.Object,
            _publishEndpoint.Object
        )
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = Helpers.GetClaimsPrincipal()
                }
            }
        };
    }

    [Fact]
    public async Task GetAuctions_WithNoParams_Returns10Auctions()
    {
        // Arrange
        var auctions = _fixture.CreateMany<AuctionDto>(10).ToList();
        _auctionRepository
            .Setup(repository => repository.GetAuctionsAsync(null))
            .ReturnsAsync(auctions);
        // Action
        var results = await _auctionsController.GetAllAuctions(null);
        // Assert
        Assert.Equal(10, results?.Value?.Count);
        Assert.IsType<ActionResult<List<AuctionDto>>>(results);
    }

    [Fact]
    public async Task GetAuctionById_WithValidGuid_ReturnsAuction()
    {
        // Arrange
        var auction = _fixture.Create<AuctionDto>();
        _auctionRepository
            .Setup(repository => repository.GetAuctionByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(auction);
        // Action
        var result = await _auctionsController.GetAuctionById(auction.Id);
        // Assert
        Assert.Equal(auction.Name, result.Value.Name);
        Assert.IsType<ActionResult<AuctionDto>>(result);
    }

    [Fact]
    public async Task GetAuctionById_WithInvalidGuid_ReturnsNotFound()
    {
        // Arrange
        _auctionRepository
            .Setup(repository => repository.GetAuctionByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(value: null);
        // Action
        var result = await _auctionsController.GetAuctionById(Guid.NewGuid());
        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task CreateAuction_WithValidCreateAuctionDto_ReturnsCreatedAtAction()
    {
        // Arrange
        var createAuctionDto = _fixture.Create<CreateAuctionDto>();
        _auctionRepository
            .Setup(repo => repo.AddAuction(It.IsAny<Auction>()));
        _auctionRepository
            .Setup(repository => repository.SaveChangesAsync()).ReturnsAsync(true);

        createAuctionDto.Files = null; // Skip test IFormFile

        // Action
        var result = await _auctionsController.CreateAuction(createAuctionDto);
        var createdResult = result.Result as CreatedAtActionResult;

        // Assert
        Assert.NotNull(createdResult);
        Assert.Equal("GetAuctionById", createdResult.ActionName);
        Assert.IsType<AuctionDto>(createdResult.Value);
    }

    [Fact]
    public async Task CreateAuction_FailedSave_Returns400BadRequest()
    {
        // Arrange
        var createAuctionDto = _fixture.Create<CreateAuctionDto>();
        _auctionRepository
            .Setup(repository => repository.AddAuction(It.IsAny<Auction>()));
        _auctionRepository
            .Setup(repository => repository.SaveChangesAsync()).ReturnsAsync(false);
        createAuctionDto.Files = null;
        // Action
        var result = await _auctionsController.CreateAuction(createAuctionDto);

        // Assert
        Assert.IsType<BadRequestResult>(result.Result);
    }

    [Fact]
    public async Task UpdateAuction_WithUpdateAuctionDto_ReturnsOkResponse()
    {
        // Arrange
        var auction = _fixture.Build<Auction>()
            .Without(x => x.Item).Create();
        auction.Item = _fixture.Build<Item>()
            .Without(x => x.Auction).Create();
        auction.Seller = "test";
        var updateAuctionDto = _fixture.Create<UpdateAuctionDto>();
        _auctionRepository
            .Setup(repository => repository.GetAuctionEntityByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(auction);
        _auctionRepository
            .Setup(repository => repository.SaveChangesAsync())
            .ReturnsAsync(true);

        // Action
        var result = await _auctionsController.UpdateAuction(auction.Id, updateAuctionDto);

        // Assert
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task UpdateAuction_WithInvalidUser_Returns403Forbid()
    {
        // arrange
        var auction = _fixture.Build<Auction>().Without(x => x.Item).Create();
        auction.Seller = "not-test";
        var updateDto = _fixture.Create<UpdateAuctionDto>();
        _auctionRepository.Setup(repo => repo.GetAuctionEntityByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(auction);

        // act
        var result = await _auctionsController.UpdateAuction(auction.Id, updateDto);

        // assert
        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task UpdateAuction_WithInvalidGuid_ReturnsNotFound()
    {
        // arrange
        var auction = _fixture.Build<Auction>().Without(x => x.Item).Create();
        var updateDto = _fixture.Create<UpdateAuctionDto>();
        _auctionRepository.Setup(repo => repo.GetAuctionEntityByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(value: null);

        // act
        var result = await _auctionsController.UpdateAuction(auction.Id, updateDto);

        // assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeleteAuction_WithValidUser_ReturnsOkResponse()
    {
        // arrange
        var auction = _fixture.Build<Auction>().Without(x => x.Item).Create();
        auction.Item = _fixture.Build<Item>().Without(x => x.Auction).Create();
        auction.Seller = "test";

        _auctionRepository.Setup(repo => repo.GetAuctionEntityByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(auction);
        _auctionRepository.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(true);

        auction.Item.ImageUrl = new List<string>()
        {
            Capacity = 0
        };

        // act
        var result = await _auctionsController.DeleteAuction(auction.Id);

        // assert
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task DeleteAuction_WithInvalidGuid_Returns404Response()
    {
        // arrange
        var auction = _fixture.Build<Auction>().Without(x => x.Item).Create();
        _auctionRepository.Setup(repo => repo.GetAuctionEntityByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(value: null);

        // act
        var result = await _auctionsController.DeleteAuction(auction.Id);

        // assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task DeleteAuction_WithInvalidUser_Returns403Response()
    {
        // arrange
        var auction = _fixture.Build<Auction>().Without(x => x.Item).Create();
        auction.Seller = "not-test";
        _auctionRepository.Setup(repo => repo.GetAuctionEntityByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(auction);

        // act
        var result = await _auctionsController.DeleteAuction(auction.Id);

        // assert
        Assert.IsType<ForbidResult>(result);
    }
}