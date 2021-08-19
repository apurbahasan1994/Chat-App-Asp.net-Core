using AutoMapper;
using DatingAPI.Dtos;
using DatingAPI.Models;
using DatingAPI.Repo;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepo repo;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public AuthController(IAuthRepo repo, IConfiguration configuration,IMapper mapper)
        {
            this.repo = repo;
            this.configuration = configuration;
            this.mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> register(UserForRegisterDto userForRegisterDto)
        {
            //validate user
            var username = userForRegisterDto.Username.ToLower();
            if (await repo.UserExist(username))
            {
                return BadRequest("Username Already exist");
            }
            var userToCreate = mapper.Map<User>(userForRegisterDto);
            var userToReturn=mapper.Map<UserForDetailDto>(userToCreate);
            var createdUser = await repo.Register(userToCreate,userForRegisterDto.Password);
            return CreatedAtRoute("getUser",new { controller="User",action="getUser",id=createdUser.Id}, userToReturn);//should be CreatedAtRoute
            //we need to sent back to our client the location where to get the newly created entity
        }

        [HttpPost("login")]
        public async Task<IActionResult> login(UserForLoginDto userLoginDto)
        {
            var userFromRepo = await repo.Login(userLoginDto.Username.ToLower(), userLoginDto.Password);//for user login
            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            //if user is correct then build up the token
            var claims = new[]// our token will have two claims one id and second is name
            {
                new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name,userFromRepo.UserName),
            };
            //to make sure the toke is valid token when it comes back the server needs to sign the tokrn whats we are doing here 

            //we are creating a security key
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings:Token").Value));
            //then using this key as a part of the signing credentials and encrepting the with a hashing algo
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var user = mapper.Map<UserListDto>(userFromRepo);
            return Ok(new {
                token = tokenHandler.WriteToken(token),
                user
            });
        }
       
    }
}
