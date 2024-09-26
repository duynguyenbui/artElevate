using System.Security.Claims;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using IdentityModel;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;

namespace IdentityService.Service;

public class CustomProfileService(UserManager<ApplicationUser> userManager) : IProfileService
{
    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var user = await userManager.GetUserAsync(context.Subject);
        var existingClaims = await userManager.GetClaimsAsync(user);

        var claims = new List<Claim>()
        {
            new Claim("username", user.UserName),
            new Claim("email", user.Email),
        };
        context.IssuedClaims.AddRange(claims);
        context.IssuedClaims
            .Add(existingClaims.FirstOrDefault(x => x.Type == JwtClaimTypes.Name));
    }

    public Task IsActiveAsync(IsActiveContext context)
    {
       return Task.CompletedTask;
    }
}