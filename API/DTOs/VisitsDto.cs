using System;

namespace API.DTOs;

public class VisitsDto
{
    public int UserId { get; set; }
    public string? Username { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime VisitedAt { get; set; }
}
