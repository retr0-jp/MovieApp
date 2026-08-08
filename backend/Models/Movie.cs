namespace backend.Models;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public int Rating { get; set; }        // 例: 5段階評価
    public string Comment { get; set; } = "";
    public DateTime WatchedDate { get; set; }
}