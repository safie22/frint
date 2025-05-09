using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentMate.API.Models
{
    public class SavedProperty
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int PropertyId { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("PropertyId")]
        public Property Property { get; set; } = null!;
        
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
} 