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
    public class MessageController : ControllerBase
    {
        private readonly IDatingApiRepo apiRepo;
        private readonly IMapper mapper;

        public MessageController(IDatingApiRepo apiRepo, IMapper mapper)
        {
            this.apiRepo = apiRepo;
            this.mapper = mapper;
        }

        [HttpGet("{id}",Name ="getMessages")]
        public async Task<IActionResult> getMessages(int userId,int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var messageFromRepo = await apiRepo.getMessages(id);
            if (messageFromRepo == null)
            {
                return NotFound();
            }
            return Ok(messageFromRepo);
        }
        [HttpGet("getMessagesForUser/{userId}")]
        public async Task<IActionResult> getMessagesForUser(int userId ,[FromQuery] MessageParams messageParams)
        {
            messageParams.UserId = userId;
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var messageFromRepo = await apiRepo.getMessagesForUser(messageParams);
            var messages = mapper.Map<IEnumerable<Message>>(messageFromRepo);
            Response.AddPagination(messageFromRepo.CurrentPage, messageFromRepo.PageSize, messageFromRepo.TotalCount, messageFromRepo.TotalPage);
           
            return Ok(messages);
        }

        [HttpGet("GetMessageThread/{userId}/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messagesFromRepo = await apiRepo.getMessageThread(userId, recipientId);

            var messageThread = mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);

            return Ok(messageThread);
        }

        [HttpPost("createMessage/{userId}")]
        public async Task<IActionResult> createMessage(int userId,MessageForCreationDto messageForCreationDto)
        {
            var sender = await apiRepo.GetUser(userId);
            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            messageForCreationDto.SenderId = userId;
            var recipient = await apiRepo.GetUser(messageForCreationDto.RecipientId);
            if (recipient == null)
            {
                return BadRequest("Cound not found user");
            }
            var message = mapper.Map<Message>(messageForCreationDto);
            apiRepo.Add(message);
            if(await apiRepo.SaveAll())
            {
                var messageToReturn = mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("getMessages", new { id = message.Id }, messageToReturn);
            }
            throw new Exception("Creating the mesage failed on save");
        }
        [HttpPost("deleteMessage/{id}/{userId}")]
        public async Task<IActionResult> deleteMessage(int id,int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var messageFromRepo = await apiRepo.getMessages(id);
            if (messageFromRepo==null)
            {
                return NotFound();
            }
            if (messageFromRepo.SenderId == userId)
            {
                messageFromRepo.SenderDeleted=true;
            }
            if (messageFromRepo.RecipientId == userId)
            {
                messageFromRepo.RecipientDeleted = true;
            }
            if(messageFromRepo.SenderDeleted==true && messageFromRepo.RecipientDeleted == true)
            {
               apiRepo.Delete(messageFromRepo);
            }
            if (await apiRepo.SaveAll())
            {
                return NoContent();
            }
            throw new Exception("Unable to delete message");


        }
       [HttpPost("readMessage/{id}/{userId}")]
       public async Task<IActionResult> readMessage(int id,int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var message = await apiRepo.getMessages(id);
            if (message.RecipientId != userId)
            {
                return Unauthorized();
            }
            message.IsRead = true;
            message.DateRead = DateTime.Now;
            await apiRepo.SaveAll();
            return NoContent();

        }
    }
}
