using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;
 public class UsersVisitsRepository(DataContext context, IMapper mapper) : IUsersVisitsRepository
    {
        public async Task<PagedList<MemberDto>> GetVisitedProfilesAsync(VisitParams visitParams)
        {
            var query = context.Visits
                .Where(v => v.VisitedUser.UserName == visitParams.CurrentUsername)
                .Where(v => visitParams.Filter == "allVisits" || 
                            (visitParams.Filter == "visitsInPastMonth" && v.VisitDate >= DateTime.UtcNow.AddMonths(-1)))
                .OrderByDescending(v => v.VisitDate)
                .Select(v => v.VisitedUser)
                .AsQueryable();

            return await PagedList<MemberDto>.CreateAsync(
                query.ProjectTo<MemberDto>(mapper.ConfigurationProvider),
                visitParams.PageNumber,
                visitParams.PageSize);
        }

        public async Task<PagedList<MemberDto>> GetProfileVisitorsAsync(VisitParams visitParams)
        {
            var query = context.Visits
                .Where(v => v.Visitor.UserName == visitParams.CurrentUsername)
                .Where(v => visitParams.Filter == "allVisits" || 
                            (visitParams.Filter == "visitsInPastMonth" && v.VisitDate >= DateTime.UtcNow.AddMonths(-1)))
                .OrderByDescending(v => v.VisitDate)
                .Select(v => v.Visitor)
                .AsQueryable();

            return await PagedList<MemberDto>.CreateAsync(
                query.ProjectTo<MemberDto>(mapper.ConfigurationProvider),
                visitParams.PageNumber,
                visitParams.PageSize);
        }
    }