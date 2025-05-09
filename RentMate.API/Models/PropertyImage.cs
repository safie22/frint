using System.ComponentModel.DataAnnotations;

namespace RentMate.API.Models
{
    public class PropertyImage
    {
        public int Id { get; set; }

        [Required]
        public int PropertyId { get; set; }
        public Property Property { get; set; } = null!;

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
} 