using System.ComponentModel.DataAnnotations;

namespace RentMate.API.Models
{
    public class Property
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        public decimal Price { get; set; }
        
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public decimal Area { get; set; }
        
        [Required]
        public int LandlordId { get; set; }
        public User Landlord { get; set; } = null!;
        
        public PropertyStatus Status { get; set; } = PropertyStatus.Pending;
        
        public int ViewCount { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
        public ICollection<Proposal> Proposals { get; set; } = new List<Proposal>();
        public ICollection<SavedProperty> SavedByUsers { get; set; } = new List<SavedProperty>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }

    public enum PropertyStatus
    {
        Pending,
        Approved,
        Rejected,
        Rented
    }
} 