using System.Text.Json.Serialization;
using AuctionService.Consumers;
using AuctionService.Core;
using AuctionService.Data;
using AuctionService.Repositories;
using AuctionService.Services;
using AuctionService.Services.Implements;
using CloudinaryDotNet.Actions;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using OpenAI.Net;
using Polly;

// Create builder 
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenAIServices(options =>
{
    options.ApiKey = builder.Configuration["OpenAI:ApiKey"];
    options.ApiUrl = builder.Configuration["OpenAI:Endpoint"] ?? string.Empty;
});
// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddDbContext<AuctionDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IAuctionRepository, AuctionRepository>();
builder.Services.AddMassTransit(x =>
{
    x.AddEntityFrameworkOutbox<AuctionDbContext>(options =>
    {
        options.QueryDelay = TimeSpan.FromSeconds(10);
        options.UsePostgres();
        options.UseBusOutbox();
    });

    x.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));

    x.UsingRabbitMq((context, configurator) =>
    {
        configurator.UseRetry(r =>
        {
            r.Handle<RabbitMqConnectionException>();
            r.Interval(5, TimeSpan.FromSeconds(5));
        });

        configurator.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });

        configurator.ConfigureEndpoints(context);
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["IdentityServiceUrl"];
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters.ValidateAudience = false;
        options.TokenValidationParameters.NameClaimType = "username";
    });
builder.Services.AddTransient<IAuctionAI, AuctionAI>();
builder.Services.AddGrpc();
builder.Services.AddScoped<IImageService<ImageUploadResult, DeletionResult>, CloudinaryService>();

// Construct application
var app = builder.Build();

// Configure middlewares
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGrpcService<GrpcAuctionService>();
// Global Handler Error
app.UseExceptionHandler();

// Polly
var retryPolicy = Policy
    .Handle<NpgsqlException>()
    .WaitAndRetry(5, retryAttempt => TimeSpan.FromSeconds(10));

// Seed Database
retryPolicy.ExecuteAndCapture(() => DbInitializer.InitDatabase(app));

// Run application
app.Run();

public partial class Program
{
}