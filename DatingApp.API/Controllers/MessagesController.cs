using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.DTOs;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using DatingApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route ("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMapper _mapper;
        private IDatingRepository _repo;

        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet("{id}", Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo == null)
                return NotFound();

            return Ok(messageFromRepo);    

        }

        [HttpGet]
        public async Task<IActionResult> GetMessageForUser(int userId, [FromQuery]MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageParams.UserId = userId;

            var messagesFromRepo = await _repo.GetMessageForUser(messageParams);
            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);   
            Response.AddPagination(messagesFromRepo.CurrentPage,
                                   messagesFromRepo.PageSize, 
                                   messagesFromRepo.TotalCount, 
                                   messagesFromRepo.TotalPages);
            return Ok(messages);                       
        }

        [HttpGet("thread/{receipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int receipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessageThread(userId,receipientId);
            var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageFromRepo);
            
            return Ok(messageThread);    
        }


        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

             messageForCreationDto.SenderId = userId;

             var recipient = await _repo.GetUser(messageForCreationDto.ReceipientId);

             if (recipient == null)  
                return BadRequest("Coundn't find user");

             var message = _mapper.Map<Message>(messageForCreationDto);    
             _repo.Add(message);

             var messageToReturn = _mapper.Map<MessageForCreationDto>(message);

             if (await _repo.SaveAll())
                return CreatedAtRoute("GetMessage", new Message{Id = message.Id}, messageToReturn);
             
             throw new Exception("Creating the message failed on save");
        }
    }
}