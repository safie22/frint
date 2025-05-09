using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentMate.API.Models
{
    public class Report
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ReporterId { get; set; }

        [Required]
        public ReportType Type { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public string? RelatedEntityId { get; set; }

        [Required]
        public ReportStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ResolvedAt { get; set; }

        [ForeignKey("ReporterId")]
        public User Reporter { get; set; } = null!;
    }

    public enum ReportType
    {
        Property,
        User,
        Comment,
        Proposal,
        Payment,
        Other
    }

    public enum ReportStatus
    {
        Pending,
        UnderReview,
        Resolved,
        Rejected
    }
} 