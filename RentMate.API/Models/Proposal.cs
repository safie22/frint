using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentMate.API.Models
{
    public class Proposal
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int PropertyId { get; set; }
        
        [Required]
        public int TenantId { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ProposedRent { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        [Required]
        [MaxLength(1000)]
        public string Message { get; set; } = string.Empty;
        
        public string? DocumentPath { get; set; }
        
        [Required]
        public ProposalStatus Status { get; set; } = ProposalStatus.Pending;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        [ForeignKey("PropertyId")]
        public Property Property { get; set; } = null!;
        
        [ForeignKey("TenantId")]
        public User Tenant { get; set; } = null!;
    }

    public enum ProposalStatus
    {
        Pending,
        Accepted,
        Rejected,
        Cancelled
    }
} 