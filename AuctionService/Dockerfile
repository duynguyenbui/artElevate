FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
EXPOSE 80

# Copy all. csproj files and restore as distinct layers
COPY ArtElevate.sln ArtElevate.sln 
COPY AuctionService/AuctionService.csproj AuctionService/AuctionService.csproj
COPY SearchService/SearchService.csproj SearchService/SearchService.csproj
COPY GatewayService/GatewayService.csproj GatewayService/GatewayService.csproj
COPY BiddingService/BiddingService.csproj BiddingService/BiddingService.csproj
COPY NotificationService/NotificationService.csproj NotificationService/NotificationService.csproj
COPY AuctionService.UnitTests/AuctionService.UnitTests.csproj AuctionService.UnitTests/AuctionService.UnitTests.csproj
COPY AuctionService.IntegrationTests/AuctionService.IntegrationTests.csproj AuctionService.IntegrationTests/AuctionService.IntegrationTests.csproj
COPY Contracts/Contracts.csproj Contracts/Contracts.csproj
COPY IdentityService/IdentityService.csproj IdentityService/IdentityService.csproj

# Restore package dependencies
RUN dotnet restore ArtElevate.sln

# Copy the app folders over
COPY AuctionService AuctionService
COPY Contracts Contracts
WORKDIR /app/AuctionService
RUN dotnet publish -c Release -o /app/out

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "AuctionService.dll"]

