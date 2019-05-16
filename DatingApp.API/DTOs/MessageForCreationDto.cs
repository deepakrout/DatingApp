using System;

namespace DatingApp.API.DTOs
{
    public class MessageForCreationDto
    {
        public int SenderId { get; set; }
        public int ReceipientId { get; set; }
        public DateTime MessageSent { get; set; }
        public string Content { get; set; }
        public MessageForCreationDto()
        {
            MessageSent = DateTime.Now;
        }
    }
}