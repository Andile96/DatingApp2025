using System;
using API.DTOs;
using API.Helpers;

namespace API.Interfaces;

public interface IUsersVisitsRepository
{
   Task TrackVisitAsync(int visitorId, int visitedId);
   Task<PagedList<MemberDto>> GetVisitsAsync(int currentUserId, VisitParams visitParams);
    

}
