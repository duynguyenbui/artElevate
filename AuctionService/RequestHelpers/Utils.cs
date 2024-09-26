using System.Text.RegularExpressions;

namespace AuctionService.RequestHelpers;

public static class Utils
{
    public static string GetPublicIdFromCloudinaryUrl(string imageUrl)
    {
        try
        {
            Uri uri = new Uri(imageUrl);
            Regex regex = new Regex(@"/v\d+/(?<publicId>[\w\d_\-./]+)\.\w+$");
            Match match = regex.Match(uri.AbsolutePath);
            if (match.Success)
                return match.Groups["publicId"].Value;
            throw new Exception("Can't not extract Public Id from Image");
        }
        catch (UriFormatException)
        {
            Console.WriteLine("URL không hợp lệ.");
            throw new Exception("Can't not extract Public Id from Image");
        }
    }
}