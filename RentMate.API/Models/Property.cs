using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentMate.API.Models
{
    public class Property
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int LandlordId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string City { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string State { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(20)]
        public string ZipCode { get; set; } = string.Empty;
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Area { get; set; }
        
        [Required]
        public int Bedrooms { get; set; }
        
        [Required]
        public int Bathrooms { get; set; }
        
        [Required]
        public PropertyType Type { get; set; }
        
        [Required]
        public PropertyStatus Status { get; set; }
        
        [Column(TypeName = "decimal(10,8)")]
        public decimal? Latitude { get; set; }
        
        [Column(TypeName = "decimal(11,8)")]
        public decimal? Longitude { get; set; }
        
        [MaxLength(500)]
        public string? MainImageUrl { get; set; }
        
        public bool HasParking { get; set; }
        public bool HasPool { get; set; }
        public bool HasGarden { get; set; }
        public bool HasSecurity { get; set; }
        public bool IsFurnished { get; set; }
        public bool AllowsPets { get; set; }
        
        [MaxLength(1000)]
        public string? AdditionalAmenities { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        public DateTime? RentedAt { get; set; }
        
        public int ViewCount { get; set; }
        
        [ForeignKey("LandlordId")]
        public User Landlord { get; set; } = null!;
        
        public ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();
        
        public ICollection<SavedProperty> SavedByUsers { get; set; } = new List<SavedProperty>();
        
        public ICollection<Proposal> Proposals { get; set; } = new List<Proposal>();
        
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        
        public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
        
        public ICollection<PropertyView> Views { get; set; } = new List<PropertyView>();
    }

    public enum PropertyType
    {
        Apartment,
        House,
        Villa,
        Studio,
        Room,
        Office,
        Shop,
        Warehouse
    }

    public enum PropertyStatus
    {
        Pending,
        Available,
        Approved,
        Rejected,
        Rented,
        UnderMaintenance
    }
} 