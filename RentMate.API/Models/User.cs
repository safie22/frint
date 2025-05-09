using System.ComponentModel.DataAnnotations;

namespace RentMate.API.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = "Tenant"; // Default role
        
        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }

        // Navigation properties
        public ICollection<Property> Properties { get; set; } = new List<Property>();
        public ICollection<Proposal> Proposals { get; set; } = new List<Proposal>();
        public ICollection<SavedProperty> SavedProperties { get; set; } = new List<SavedProperty>();
        public ICollection<Message> SentMessages { get; set; } = new List<Message>();
        public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }

    public enum UserRole
    {
        Admin,
        Landlord,
        Tenant
    }
} 