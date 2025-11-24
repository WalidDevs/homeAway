using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.DataAdapters;
using backend.DataAdapters.DataAdaptersFactory;
using backend.Dtos;
using backend.JeuxDeDonnees;
using BackendEFDataProvider.Data;
using BackendEFDataProvider.RepositoryFactories;
using BackendEFDataProvider.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UniversiteEFDataProvider.Repositories;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

var builder = WebApplication.CreateBuilder(args);

//Configuration CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Autorise uniquement React
            .AllowAnyMethod() // Autorise toutes les méthodes HTTP (GET, POST, PUT, DELETE)
            .AllowAnyHeader(); // Autorise tous les en-têtes
    });
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 268435456;; 
});

//Configuration de la connexion à la base de données MySQL
string connectionString = builder.Configuration.GetConnectionString("MySqlConnection") 
                          ?? throw new InvalidOperationException("Connexion MySQL introuvable.");

builder.Services.AddDbContext<LocationDbContext>(options =>
    options.UseMySQL(connectionString));

//Enregistrement des repositories et services
builder.Services.AddScoped<IRepositoryFactory, RepositoryFactory>();
builder.Services.AddScoped<RepositoryFactory, RepositoryFactory>();
builder.Services.AddScoped<IUtilisateurRepository, UtilisateurRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<BdBuilder, BasicBdBuilder>();


// Configuration de JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

//Ajout des services API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowReactApp");
app.UseRouting();
app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllers();

// Endpoint de connexion
app.MapPost("/custom-login", async (
    [FromBody] LoginDto loginDto,
    [FromServices] IUtilisateurRepository utilisateurRepository,
    [FromServices] IConfiguration configuration
) =>
{
    // Récupérer l'utilisateur par email
    var utilisateur = await utilisateurRepository.GetByEmailAsync(loginDto.Email);
    if (utilisateur == null || !BCrypt.Net.BCrypt.Verify(loginDto.Mot_de_passe, utilisateur.Mot_de_passe))
    {
        return Results.Unauthorized();
    }

    // Récupérer les rôles de l'utilisateur
    var userRoles = utilisateur.Roles.Select(r => r.Type_role).ToList();

    // Créer les claims (informations incluses dans le token)
    var authClaims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, utilisateur.Email),
        new Claim(ClaimTypes.Email, utilisateur.Email),
        new Claim(ClaimTypes.NameIdentifier, utilisateur.Id_utilisateur.ToString()),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

    // Ajouter chaque rôle trouvé aux claims
    foreach (var role in userRoles)
    {
        authClaims.Add(new Claim(ClaimTypes.Role, role));
    }

    // Générer le token JWT
    var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtSettings:SecretKey"]));
    var token = new JwtSecurityToken(
        expires: DateTime.Now.AddHours(3),
        claims: authClaims,
        signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
    );

    // Retourner le token et sa date d'expiration
    return Results.Ok(new
    {
        token = new JwtSecurityTokenHandler().WriteToken(token),
        expiration = token.ValidTo
    });
});

// Initialisation de la base de données
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;  
    var repositoryFactory = services.GetRequiredService<IRepositoryFactory>();
    var seedBuilder = new BasicBdBuilder(repositoryFactory);
    await seedBuilder.BuildBdAsync();
}

app.Run();