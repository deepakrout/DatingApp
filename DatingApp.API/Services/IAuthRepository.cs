using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Services
{
    public interface IAuthRepository
    {
         Task<User> Register(User user, string password);
         Task<User> LoginAsync(string username, string password);
         Task<bool> UserExists(string username);
    }
}