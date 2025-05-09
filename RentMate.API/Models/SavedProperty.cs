using System.ComponentModel.DataAnnotations;

namespace RentMate.API.Models
{
    public class SavedProperty
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        [Required]
        public int PropertyId { get; set; }
        public Property Property { get; set; } = null!;
        
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
    }
} 