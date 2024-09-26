using AuctionService.DTOs;
using AuctionService.Entities;
using AuctionService.Repositories;
using AuctionService.RequestHelpers;
using AuctionService.Services;
using AutoMapper;
using CloudinaryDotNet.Actions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using OpenAI.Net;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController(
    IAuctionRepository auctionRepository,
    IAuctionAI auctionAi,
    IMapper mapper,
    IImageService<ImageUploadResult, DeletionResult> imageService,
    IPublishEndpoint publishEndpoint
) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(string? date)
    {
        return await auctionRepository.GetAuctionsAsync(date);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        var auction = await auctionRepository.GetAuctionByIdAsync(id);
        if (auction is null) return NotFound();
        return auction;
    }

    [HttpGet("predict/{id}")]
    public async Task<ActionResult<string>> GetAuctionPricePredict(Guid id)
    {
        var result = await auctionAi.GetPredictPriceAuction(id);
        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction([FromForm] CreateAuctionDto createAuctionDto)
    {
        var auction = mapper.Map<Auction>(createAuctionDto);
        auction.Seller = User.Identity?.Name;

        List<string> imageUrls = new List<string>();
        if (createAuctionDto.Files is not null)
        {
            foreach (var formFile in createAuctionDto.Files)
            {
                var imageUploadResult = await imageService.AddImageAsync(formFile);
                imageUrls.Add(imageUploadResult.SecureUrl.ToString());
            }
        }

        auction.Item.ImageUrl = imageUrls;
        auctionRepository.AddAuction(auction);

        var newAuction = mapper.Map<AuctionDto>(auction);

        // RabbitMQ
        await publishEndpoint.Publish(mapper.Map<AuctionCreated>(newAuction));

        var result = await auctionRepository.SaveChangesAsync();

        if (!result) return BadRequest();

        return CreatedAtAction(nameof(GetAuctionById), new { auction.Id }, newAuction);
    }

    [HttpPatch("{id}")]
    [Authorize]
    public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
    {
        var auction = await auctionRepository.GetAuctionEntityByIdAsync(id);

        if (auction is null) return NotFound();

        if (!auction.Seller.Equals(User.Identity?.Name))
            return Forbid();

        // Map if exist attributes update
        auction.Item.Artist = updateAuctionDto.Artist ?? auction.Item.Artist;
        auction.Item.Name = updateAuctionDto.Name ?? auction.Item.Name;
        auction.Item.Description = updateAuctionDto.Description ?? auction.Item.Description;
        auction.Item.Width = updateAuctionDto.Width ?? auction.Item.Width;
        auction.Item.Height = updateAuctionDto.Height ?? auction.Item.Height;
        auction.Item.Medium = updateAuctionDto.Medium ?? auction.Item.Medium;
        auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;
        auction.ReservePrice = updateAuctionDto.ReservePrice ?? auction.ReservePrice;
        auction.AuctionEnd = updateAuctionDto.AuctionEnd ?? auction.AuctionEnd;
        // RabbitMQ
        await publishEndpoint.Publish(mapper.Map<AuctionUpdated>(auction));

        var result = await auctionRepository.SaveChangesAsync();
        return result ? Ok() : BadRequest("Problem when save changes update");
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await auctionRepository.GetAuctionEntityByIdAsync(id);

        if (auction is null) return NotFound();

        if (!auction.Seller.Equals(User.Identity.Name)) return Forbid();
        foreach (var imageUrl in auction.Item?.ImageUrl)
        {
            await imageService.DeleteImageAsync(Utils.GetPublicIdFromCloudinaryUrl(imageUrl));
        }

        auctionRepository.RemoveAuction(auction);

        await publishEndpoint.Publish<AuctionDeleted>(new { Id = auction.Id.ToString() });

        var result = await auctionRepository.SaveChangesAsync();
        return result ? Ok() : BadRequest("Couldn't delete auction");
    }
}