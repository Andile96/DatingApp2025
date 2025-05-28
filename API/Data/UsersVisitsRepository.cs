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

     public async Task TrackVisitAsync(int visitorId, int visitedId)
    {
       if (visitorId == visitedId) return;

        var visit = await context.Visits.FindAsync(visitorId, visitedId);
        if (visit != null)
        {
            visit.VisitDate = DateTime.UtcNow;
        }
        else
        {
            context.Visits.Add(new Visits
            {
                VisitorId = visitorId,
                VisitedUserId = visitedId
            });
        }

        await context.SaveChangesAsync();
    }

    public async Task<PagedList<MemberDto>> GetVisitsAsync(int currentUserId, VisitParams visitParams)
    {
        var query = context.Visits.AsQueryable();

        if (visitParams.Tab == "visited")
        {
            query = query.Where(v => v.VisitorId == currentUserId);
        }
        else if (visitParams.Tab == "visitedBy")
        {
            query = query.Where(v => v.VisitorId == currentUserId);
        }

        if (visitParams.Filter == "visitsInPastMonth")
        {
            var pastMonth = DateTime.UtcNow.AddMonths(-1);
            query = query.Where(v => v.VisitDate >= pastMonth);
        }

        var userId = query
            .OrderByDescending(v => v.VisitDate)
            .Select(v => visitParams.Tab == "visited"
                ? v.VisitedUserId
                : v.VisitorId)
            .ToListAsync();

        var memberQuery = context.Users
            .Where(u => userId.Equals(u.Id))
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider);

        return await PagedList<MemberDto>.CreateAsync(memberQuery, visitParams.PageNumber, visitParams.PageSize);
    }

   
}
