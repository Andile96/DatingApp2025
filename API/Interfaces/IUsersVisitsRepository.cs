using System;
using API.DTOs;
using API.Helpers;

namespace API.Interfaces;

public interface IUsersVisitsRepository
{
   Task<PagedList<MemberDto>> GetVisitedProfilesAsync(VisitParams visitParams);
   Task<PagedList<MemberDto>> GetProfileVisitorsAsync(VisitParams visitParams);
    

}
