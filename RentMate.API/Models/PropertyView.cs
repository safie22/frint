using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentMate.API.Models
{
    public class PropertyView
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PropertyId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string IPAddress { get; set; } = string.Empty;

        [Required]
        public string UserAgent { get; set; } = string.Empty;

        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PropertyId")]
        public Property Property { get; set; } = null!;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
} 