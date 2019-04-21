using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.DTOs;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using DatingApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Route ("api/users/{userId}/photos")]
    [ApiController]
    [Authorize]

    public class PhotosController : ControllerBase
    {
        private IDatingRepository _repo;
        private IMapper _mapper;
        private IOptions<CloudinarySettings> _cloudinaryCofig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, 
                                IMapper mapper, 
                                IOptions<CloudinarySettings> coundinaryConfig)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryCofig = coundinaryConfig;

            Account acc = new Account(
                _cloudinaryCofig.Value.CloudName,
                _cloudinaryCofig.Value.ApiKey,
                _cloudinaryCofig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet("{id}",Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id) 
        {
            var photoFromRepo = await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok (photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUSer(int userId, 
                                        [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            // Check the user against authenicated userID. If not found return unauthorized
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

             // Get the User from Repo   
             var userFromRepo = await _repo.GetUser(userId);   

             // Get the photo file handler 
             var file = photoForCreationDto.File;

             // create upload result placeholder of type ImageUploadResult 
             var uploadResults = new ImageUploadResult();

            // Chek if file is not empty
             if (file.Length > 0) {

                 // Open file stream
                 using (var stream = file.OpenReadStream())
                 {
                     // Create uplod params with image transformation options
                     var uploadParam = new ImageUploadParams()
                     {
                         File = new FileDescription(file.Name, stream),
                         Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                     };

                     // Uplaod photo
                     uploadResults = _cloudinary.Upload(uploadParam);
                 }
             }
            
             // Set photo url and photo id received from Cloudinary
             photoForCreationDto.Url = uploadResults.Uri.ToString();
             photoForCreationDto.PublicId = uploadResults.PublicId;
             
             // Map to auto mapper
             var photo = _mapper.Map<Photo>(photoForCreationDto);

             // Set main if no main photo exists
             if (!userFromRepo.Photos.Any(u => u.IsMain))
                photo.IsMain = true;
            
            // Add photo details to the DB
             userFromRepo.Photos.Add(photo);
             
             if ( await _repo.SaveAll() )   
             {
                 // Create mapper for photo to return 
                 var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                 return CreatedAtRoute("GetPhoto",new { id = photo.Id }, photoToReturn);
             }

             return BadRequest("Cloud not add the photo");
        }

    }    
}