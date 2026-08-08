using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

var builder = WebApplication.CreateBuilder(args);

// DB接続の設定(SQLiteファイルを使う)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=movies.db"));

// フロントエンド(別ポート)からのアクセスを許可する設定
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 起動時にDBファイルを自動作成
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

// ---- CRUD APIエンドポイント ----

// 一覧取得
app.MapGet("/api/movies", async (AppDbContext db) =>
    await db.Movies.OrderByDescending(m => m.WatchedDate).ToListAsync());

// 1件取得
app.MapGet("/api/movies/{id}", async (int id, AppDbContext db) =>
    await db.Movies.FindAsync(id) is { } movie ? Results.Ok(movie) : Results.NotFound());

// 新規登録
app.MapPost("/api/movies", async (Movie movie, AppDbContext db) =>
{
    db.Movies.Add(movie);
    await db.SaveChangesAsync();
    return Results.Created($"/api/movies/{movie.Id}", movie);
});

// 更新
app.MapPut("/api/movies/{id}", async (int id, Movie input, AppDbContext db) =>
{
    var movie = await db.Movies.FindAsync(id);
    if (movie is null) return Results.NotFound();

    movie.Title = input.Title;
    movie.Rating = input.Rating;
    movie.Comment = input.Comment;
    movie.WatchedDate = input.WatchedDate;
    await db.SaveChangesAsync();
    return Results.Ok(movie);
});

// 削除
app.MapDelete("/api/movies/{id}", async (int id, AppDbContext db) =>
{
    var movie = await db.Movies.FindAsync(id);
    if (movie is null) return Results.NotFound();
    db.Movies.Remove(movie);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();