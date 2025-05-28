using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Policy = "RequireVIPRole")]
    public class UserVisitsController(IUnitOfWork unitOfWork) : ControllerBase
    {
        [HttpPost("{visitedId}")] 
        public async Task<IActionResult> TrackVisit(int visitedId)
        {
            var visitorId = User.GetUserId();
            await unitOfWork.UsersVisitsRepository.TrackVisitAsync(visitorId, visitedId);
            return Ok("dddVisit tracked successfully.");
        }
        [HttpGet]
        public async Task<ActionResult<PagedList<MemberDto>>> GetVisits([FromQuery] VisitParams visitParams)
        {
            var currentUserId = User.GetUserId();
            var users = await unitOfWork.UsersVisitsRepository.GetVisitsAsync(currentUserId, visitParams);
            Response.AddPaginationHeader(users);
            return Ok(users);
        }

    }
}
