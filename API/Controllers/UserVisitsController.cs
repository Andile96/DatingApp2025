using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Policy = "RequireVIPRole")]
    public class UserVisitsController(IUnitOfWork unitOfWork) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetVisitedProfiles([FromQuery] VisitParams visitParams)
        {
            visitParams.CurrentUsername = User.GetUsername();
            var users = await unitOfWork.UsersVisitsRepository.GetVisitedProfilesAsync(visitParams);
            Response.AddPaginationHeader(users);
            return Ok(users);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetProfileVisitors([FromQuery] VisitParams visitParams)
        {
            visitParams.CurrentUsername = User.GetUsername();
            var users = await unitOfWork.UsersVisitsRepository.GetProfileVisitorsAsync(visitParams);
            Response.AddPaginationHeader(users);
            return Ok(users);
        }

    }
}
