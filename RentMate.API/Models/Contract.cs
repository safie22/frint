using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentMate.API.Models
{
    public class Contract
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
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MonthlyRent { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal SecurityDeposit { get; set; }

        [Required]
        public ContractStatus Status { get; set; }

        [MaxLength(1000)]
        public string? Terms { get; set; }

        [MaxLength(500)]
        public string? AdditionalNotes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? SignedAt { get; set; }

        public DateTime? TerminatedAt { get; set; }

        [ForeignKey("PropertyId")]
        public Property Property { get; set; } = null!;

        [ForeignKey("TenantId")]
        public User Tenant { get; set; } = null!;

        [ForeignKey("LandlordId")]
        public User Landlord { get; set; } = null!;
    }

    public enum ContractStatus
    {
        Draft,
        Pending,
        Active,
        Expired,
        Terminated
    }
} 