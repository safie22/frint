using System.ComponentModel.DataAnnotations;

namespace RentMate.API.Models
{
    public class Comment
    {
        public int Id { get; set; }

        [Required]
        public int PropertyId { get; set; }
        public Property Property { get; set; } = null!;

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
} 