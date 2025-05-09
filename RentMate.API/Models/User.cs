using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentMate.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? ProfileImageUrl { get; set; }
        
        [MaxLength(1000)]
        public string? Bio { get; set; }
        
        [MaxLength(100)]
        public string? FacebookUrl { get; set; }
        
        [MaxLength(100)]
        public string? TwitterUrl { get; set; }
        
        [MaxLength(100)]
        public string? LinkedInUrl { get; set; }
        
        [Required]
        public UserRole Role { get; set; }
        
        public bool IsApproved { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }
        public DateTime? LastActiveAt { get; set; }

        // Navigation properties
        public ICollection<Property> Properties { get; set; } = new List<Property>();
        public ICollection<Proposal> Proposals { get; set; } = new List<Proposal>();
        public ICollection<SavedProperty> SavedProperties { get; set; } = new List<SavedProperty>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<ChatMessage> SentMessages { get; set; } = new List<ChatMessage>();
        public ICollection<ChatMessage> ReceivedMessages { get; set; } = new List<ChatMessage>();
        public ICollection<Report> Reports { get; set; } = new List<Report>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
        public ICollection<PropertyView> PropertyViews { get; set; } = new List<PropertyView>();
    }

    public enum UserRole
    {
        Admin,
        Landlord,
        Tenant
    }
} 