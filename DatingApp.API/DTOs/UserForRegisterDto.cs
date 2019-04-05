using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOs
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName  { get; set; }

        [Required]
        [StringLength(8,MinimumLength=6, ErrorMessage="You must specify password between 6 and 8 character.")]
        public string Password { get; set; }
    }
}