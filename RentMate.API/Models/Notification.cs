using System.ComponentModel.DataAnnotations;

namespace RentMate.API.Models
{
    public class Notification
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        public string Message { get; set; } = string.Empty;

        public string? Link { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }
        public NotificationType Type { get; set; }
        public int? RelatedEntityId { get; set; }
    }

    public enum NotificationType
    {
        ProposalReceived,
        ProposalStatusChanged,
        NewMessage,
        PropertyApproved,
        PropertyRejected,
        CommentReceived
    }
} 