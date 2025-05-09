using System.ComponentModel.DataAnnotations;

namespace RentMate.API.Models
{
    public class Proposal
    {
        public int Id { get; set; }
        
        [Required]
        public int PropertyId { get; set; }
        public Property Property { get; set; } = null!;
        
        [Required]
        public int TenantId { get; set; }
        public User Tenant { get; set; } = null!;
        
        [Required]
        public string Message { get; set; } = string.Empty;
        
        public string? AttachmentUrl { get; set; }
        
        public ProposalStatus Status { get; set; } = ProposalStatus.Pending;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        public string? FilePath { get; set; }
        public string? FileName { get; set; }
    }

    public enum ProposalStatus
    {
        Pending,
        Accepted,
        Rejected
    }
} 