using System;

namespace API.Entities;

public class Visits
{
    public int Id { get; set; }

    public int VisitorId { get; set; }
    public int VisitedId { get; set; }
    public DateTime VisitDate { get; set; }

    public AppUser Visitor { get; set; } = null!;
    public AppUser Visited { get; set; } = null!;

    

}
