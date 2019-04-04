using System.Threading.Tasks;
using DatingApp.API.Models;
using DatingApp.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Route ("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IAuthRepository _repo;

        public AuthController(IAuthRepository repo){
            _repo = repo;
        }
      
        [HttpPost("register")]
        public async Task<ActionResult> Register(string username, string password){
            //validate  request
            username = username.ToLower();
            if (await _repo.UserExists(username))
                return BadRequest("Username already exists!");

            var userToCreate = new User
            {
                UserName = username
            };

            var createdUser = await _repo.Register(userToCreate, password);
            
            return StatusCode(201);   
        }
    }
}