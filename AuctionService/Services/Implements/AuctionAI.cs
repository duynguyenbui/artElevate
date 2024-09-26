using AuctionService.Data;
using Microsoft.EntityFrameworkCore;
using OpenAI.Net;

namespace AuctionService.Services.Implements;

public class AuctionAI : IAuctionAI
{
    private readonly AuctionDbContext _context;
    private readonly IOpenAIService _openAiService;
    private readonly IConfiguration _configuration;

    public AuctionAI(AuctionDbContext context, IOpenAIService openAiService, IConfiguration configuration)
    {
        _context = context;
        _openAiService = openAiService;
        _configuration = configuration;
    }

    public async Task<string> GetPredictPriceAuction(Guid auctionId)
    {
        var openApi = _configuration.GetSection("OpenAI");

        if (!openApi.Exists())
        {
            return "Please provide OpenAI configuration to enable assistant.";
        }
        
        var auction = await _context.Auctions.Include(x => x.Item).SingleOrDefaultAsync(x => x.Id == auctionId);

        if (auction is null) return "Auction not found.";

        var messages = new List<Message>
        {
            Message.Create(ChatRoleType.System, "Chào mừng bạn đến với trợ lý dự đoán giá đấu giá."),
            Message.Create(ChatRoleType.User, "Bạn muốn dự đoán giá cho mục đấu giá nào?"),
            Message.Create(ChatRoleType.Assistant,
                "Vui lòng cung cấp thông tin về mục bạn muốn dự đoán giá."),
            Message.Create(ChatRoleType.User, "Tôi muốn dự đoán giá thực tế cho một cuộc đấu giá."),
            Message.Create(ChatRoleType.Assistant, "Vui lòng cung cấp thông tin về cuộc đấu giá."),
            Message.Create(ChatRoleType.User, $"Đây là thông tin về cuộc đấu giá: \n" +
                                              $"- Tên tác phẩm: {auction.Item.Name}\n" +
                                              $"- Mô tả: {auction.Item.Description}\n" +
                                              $"- Giá khởi điểm: {auction.ReservePrice}\n" +
                                              $"- Năm sáng tác: {auction.Item.Year}\n" +
                                              $"- Chiều cao tác phẩm: {auction.Item.Height}\n" +
                                              $"- Chiều rộng tác phẩm: {auction.Item.Width}\n" +
                                              $"- Ngày kết thúc: {auction.AuctionEnd}\n" +
                                              $"- ID Nghệ sĩ đấu giá: {auction.Item.Artist}\n" +
                                              $"- Chất liệu tác phẩm: {auction.Item.Medium}"),
            Message.Create(ChatRoleType.User, "Dự đoán giá thực tế của tác phẩm này là bao nhiêu? LUÔN CUNG CẤP GIÁ DỰ ĐOÁN, KHÔNG HỎI THÊM GÌ CẢ."),
        };


        var response = await _openAiService.Chat.Get(messages, o => { o.MaxTokens = 1000; });

        if (response.IsSuccess)
        {
            return response.Result?.Choices[0].Message.Content;
        }

        return response.ErrorMessage;
    }
}