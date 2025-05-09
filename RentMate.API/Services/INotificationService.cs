using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface INotificationService
    {
        Task<Notification> CreateNotificationAsync(Notification notification);
        Task<Notification?> GetNotificationByIdAsync(int id);
        Task<IEnumerable<Notification>> GetUnreadNotificationsAsync(int userId);
        Task<IEnumerable<Notification>> GetNotificationHistoryAsync(int userId, int page = 1, int pageSize = 20);
        Task<Notification?> MarkAsReadAsync(int notificationId, int userId);
        Task MarkAllAsReadAsync(int userId);
        Task DeleteNotificationAsync(int id);
        Task<int> GetUnreadCountAsync(int userId);
    }
} 