using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentMate.API.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PropertyId { get; set; }

        [Required]
        public int TenantId { get; set; }

        [Required]
        public int LandlordId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public PaymentType Type { get; set; }

        [Required]
        public PaymentStatus Status { get; set; }

        [Required]
        [MaxLength(50)]
        public string TransactionId { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

        [ForeignKey("PropertyId")]
        public Property Property { get; set; } = null!;

        [ForeignKey("TenantId")]
        public User Tenant { get; set; } = null!;

        [ForeignKey("LandlordId")]
        public User Landlord { get; set; } = null!;
    }

    public enum PaymentType
    {
        Rent,
        SecurityDeposit,
        Maintenance,
        Other
    }

    public enum PaymentStatus
    {
        Pending,
        Completed,
        Failed,
        Refunded
    }
} 