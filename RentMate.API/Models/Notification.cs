using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentMate.API.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Message { get; set; } = string.Empty;

        [Required]
        public NotificationType Type { get; set; }

        public string? RelatedEntityId { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }

    public enum NotificationType
    {
        NewMessage,
        ProposalReceived,
        ProposalAccepted,
        ProposalRejected,
        PropertyApproved,
        PropertyRejected,
        NewComment,
        SystemMessage
    }
} 