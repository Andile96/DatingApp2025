using System;

namespace API.Entities;

public class Visits
{
    public int VisitorId { get; set; }
    public int VisitedUserId { get; set; }
    public DateTime VisitDate { get; set; } = DateTime.UtcNow;

    public AppUser Visitor { get; set; } = null!;
    public AppUser VisitedUser { get; set; } = null!;
   
}
