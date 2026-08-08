// Controllers/MoviesController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")] // → api/movies になる
public class MoviesController : ControllerBase
{
    private readonly AppDbContext _db;

    // コンストラクタでDbContextを受け取る(DI)
    public MoviesController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/movies
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Movie>>> GetAll()
    {
        return await _db.Movies.OrderByDescending(m => m.WatchedDate).ToListAsync();
    }

    // GET: api/movies/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Movie>> GetById(int id)
    {
        var movie = await _db.Movies.FindAsync(id);
        if (movie is null) return NotFound();
        return movie;
    }

    // POST: api/movies
    [HttpPost]
    public async Task<ActionResult<Movie>> Create(Movie movie)
    {
        _db.Movies.Add(movie);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = movie.Id }, movie);
    }

    // PUT: api/movies/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Movie input)
    {
        var movie = await _db.Movies.FindAsync(id);
        if (movie is null) return NotFound();

        movie.Title = input.Title;
        movie.Rating = input.Rating;
        movie.Comment = input.Comment;
        movie.WatchedDate = input.WatchedDate;
        await _db.SaveChangesAsync();
        return Ok(movie);
    }

    // DELETE: api/movies/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var movie = await _db.Movies.FindAsync(id);
        if (movie is null) return NotFound();

        _db.Movies.Remove(movie);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}