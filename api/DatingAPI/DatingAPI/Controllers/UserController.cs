using AutoMapper;
using DatingAPI.Dtos;
using DatingAPI.Helpers;
using DatingAPI.Models;
using DatingAPI.Repo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingAPI.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [EnableCors("CorsPolicy")]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController: ControllerBase
    {
        private readonly IDatingApiRepo apirepo;
        private readonly IMapper mapper;

        public UserController(IDatingApiRepo apirepo, IMapper mapper)
        {
            this.apirepo = apirepo;
            this.mapper = mapper;
        }
        [HttpGet("getUsers")]
        public async Task<IActionResult> getUsers([FromQuery]UserParams userParams)
        {
            var currentUserId= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await apirepo.GetUser(currentUserId);
            userParams.UserId = userFromRepo.Id;
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }
            var ousers = await apirepo.GetUsers(userParams);
            var usersToreturn = mapper.Map<IEnumerable<UserListDto>>(ousers);
            Response.AddPagination(ousers.CurrentPage, ousers.PageSize, ousers.TotalCount, ousers.TotalPage);
            return Ok(usersToreturn);
        }
        [HttpGet("getUser/{id}", Name ="getUser")]
        public async Task<IActionResult> getUser(int id)
        {
            var ouser =await apirepo.GetUser(id);
            var userToreturn = mapper.Map<UserForDetailDto>(ouser);
            return Ok(userToreturn);
            
        }
        [HttpPut("updateUser/{id}")]
        public async Task<IActionResult> updateUser(int id,[FromBody] UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var userfromRepo = await apirepo.GetUser(id);
            mapper.Map(userForUpdateDto, userfromRepo);
            if(await apirepo.SaveAll())
            {
                return NoContent();
            }
            throw new Exception($"Updating user {id} failed on save");
        }
        [HttpPost("getLike/{userId}/{recipientId}")]
        public async Task<IActionResult> getLike(int userId, int recipientId)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var like = await apirepo.getLike(userId, recipientId);
            if (like!=null)
            {
                return BadRequest("You already liked this user");
            }
            if(await apirepo.GetUser(recipientId)==null)
            {
                return NotFound();
            }
            like = new Like
            {
                LikerId = userId,
                LikeeId=recipientId
            };
            apirepo.Add<Like>(like);
            if (await apirepo.SaveAll())
            {
                return Ok();
            }
            return BadRequest("Failed to like user");
           
        }
    }
}
