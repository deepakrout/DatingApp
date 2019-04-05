using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.DTOs;
using DatingApp.API.Models;
using DatingApp.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route ("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IAuthRepository _repo;
        private IConfiguration _config;

        public AuthController(IAuthRepository repo, IConfiguration config){
            _repo = repo;
            _config = config;
        }
      
        [HttpPost("register")]
        public async Task<ActionResult> Register(UserForRegisterDto userRegDto){
            //validate  request
            userRegDto.UserName = userRegDto.UserName.ToLower();
            if (await _repo.UserExists(userRegDto.UserName))
                return BadRequest("Username already exists!");

            var userToCreate = new User
            {
                UserName = userRegDto.UserName
            };

            var createdUser = await _repo.Register(userToCreate, userRegDto.Password);

            return StatusCode(201);   
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto loginDto){
            var userFromRepo = await _repo.LoginAsync(loginDto.Username.ToLower(),loginDto.Password);
            
            if (userFromRepo == null) 
                return Unauthorized();
            
            var claims = new [] {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8
                            .GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new {
                token = tokenHandler.WriteToken(token)
            });

        }
    }
}