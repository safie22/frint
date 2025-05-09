using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface INotificationService
    {
        Task<Notification> CreateNotificationAsync(Notification notification);
        Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId);
        Task<bool> MarkNotificationAsReadAsync(int notificationId);
        Task<int> GetUnreadNotificationCountAsync(int userId);
        Task<bool> DeleteNotificationAsync(int notificationId);
    }
} 