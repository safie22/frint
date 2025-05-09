using System.ComponentModel.DataAnnotations;

namespace RentMate.API.Models
{
    public class Message
    {
        public int Id { get; set; }

        [Required]
        public int SenderId { get; set; }
        public User Sender { get; set; } = null!;

        [Required]
        public int ReceiverId { get; set; }
        public User Receiver { get; set; } = null!;

        [Required]
        public string Content { get; set; } = string.Empty;

        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }
    }
} 