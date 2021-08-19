using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingAPI.Dtos;
using DatingAPI.Helpers;
using DatingAPI.Models;
using DatingAPI.Repo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingAPI.Controllers
{
    [EnableCors("CorsPolicy")]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CloudenaryController : ControllerBase
    {
        private readonly IDatingApiRepo repo;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarSettings> cloudenaryConfig;
        private Cloudinary _cloudenary;

        public CloudenaryController(IDatingApiRepo repo, IMapper mapper, IOptions<CloudinarSettings> cloudenaryConfig)
        {
            this.repo = repo;
            this.cloudenaryConfig = cloudenaryConfig;
            this.mapper = mapper;
            Account acc = new Account(

                cloudenaryConfig.Value.CloudName,
                cloudenaryConfig.Value.ApiKey,
                cloudenaryConfig.Value.ApiSecret

            );
            _cloudenary = new Cloudinary(acc);
        }
        [HttpGet("{id}",Name ="getPhoto")]
        public async Task<IActionResult> getPhoto(int id)
        {
            var photofromRepo =await repo.getPhoto(id);
            var photo = mapper.Map<PhotoForReturnDto>(photofromRepo);
            return Ok(photo);
        }

        
        [HttpPost("AddUserPhoto/{userId}")]
        public async Task<IActionResult> AddUserPhoto(int userId, [FromForm] PhotoForCreationDto photoForCreationDto)//int userId,[FromForm] PhotoForCreationDto photoForCreationDto
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var userfromRepo = await repo.GetUser(userId);
            var file = photoForCreationDto.File;
            var upLoadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())//read the open file into memory
                {
                    var uploadParams = new ImageUploadParams()//giving clodenary our upload param
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    upLoadResult = _cloudenary.Upload(uploadParams);

                }
            }
            photoForCreationDto.Url = upLoadResult.Url.ToString();
            photoForCreationDto.PublicId = upLoadResult.PublicId;
            try { var photo = mapper.Map<Photo>(photoForCreationDto);
                if (!userfromRepo.Photos.Any(u => u.isMain))
                {
                    photo.isMain = true;

                }
                userfromRepo.Photos.Add(photo);
                if (await repo.SaveAll())
                {
                    var photoToreturn = mapper.Map<PhotoForReturnDto>(photo);
                    return CreatedAtRoute("getPhoto", new { id = photo.Id }, photoToreturn);
                    //return Ok(photoToreturn);
                }
                return BadRequest("could not add photo");
            }
            catch(Exception e)
            {
                return BadRequest("could not add photo");
            }
            

            //if its the first photo then assigning it as the main photo.

        }
        [HttpPost("setmainPhoto/{userID}/{id}")]
        public async Task<IActionResult> setmainPhoto(int userID,int id)
        {
            if (userID != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await repo.GetUser(userID);
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photo = await repo.getPhoto(id);
            if (photo.isMain)
            {
                return BadRequest("this is already main photo");
            }
            var currentmainPhoto = await repo.getMainPhoto(userID);
            currentmainPhoto.isMain = false;
            photo.isMain = true;
            if (await repo.SaveAll())
                return NoContent();
            return BadRequest("Could not set photo to main");

        }
        [HttpDelete("deltePhoto/{userId}/{id}")]
        public async Task<IActionResult> deletePhoto(int userID,int id)
        {
            if (userID != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await repo.GetUser(userID);
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photo = await repo.getPhoto(id);
            if (photo.isMain)
            {
                return BadRequest("Cant delete main photo");
            }
            if (photo.PublicId != null) {
                var deleteParam = new DeletionParams(photo.PublicId);
                var res = _cloudenary.Destroy(deleteParam);
                if (res.Result == "ok")
                {
                    repo.Delete(photo);

                }
            }
            if (photo.PublicId == null)
            {
                repo.Delete(photo);

            }
            if (await repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest("Failed to delete photo");
        }
    }
}
