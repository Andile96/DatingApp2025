using System;

namespace API.Helpers;

public class VisitParams : PaginationParams
{
    public string ?CurrentUsername { get; set; }
    public string Filter { get; set; } = "allVisits";

}
