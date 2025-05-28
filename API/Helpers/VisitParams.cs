using System;

namespace API.Helpers;

public class VisitParams : PaginationParams
{
   
    public string Filter { get; set; } = "allVisits";
    public string Tab { get; set; } = "visited";

}
