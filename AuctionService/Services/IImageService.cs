namespace AuctionService.Services;

public interface IImageService<T, K>
{
    Task<T> AddImageAsync(IFormFile file);
    Task<K> DeleteImageAsync(string publicId);
}