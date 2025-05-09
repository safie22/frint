using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using RentMate.API.Models;
using RentMate.API.Services;
using System.Security.Claims;

namespace RentMate.API.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        private readonly INotificationService _notificationService;
        private readonly ILogger<NotificationHub> _logger;

        public NotificationHub(INotificationService notificationService, ILogger<NotificationHub> logger)
        {
            _notificationService = notificationService;
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = int.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                throw new InvalidOperationException("User ID not found in token"));

            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = int.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                throw new InvalidOperationException("User ID not found in token"));

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task GetUnreadNotifications()
        {
            try
            {
                var userId = int.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var notifications = await _notificationService.GetUnreadNotificationsAsync(userId);
                await Clients.Caller.SendAsync("UnreadNotifications", notifications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting unread notifications");
                throw;
            }
        }

        public async Task MarkAsRead(int notificationId)
        {
            try
            {
                var userId = int.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var notification = await _notificationService.MarkAsReadAsync(notificationId, userId);
                if (notification != null)
                {
                    await Clients.Caller.SendAsync("NotificationRead", notificationId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notification as read");
                throw;
            }
        }

        public async Task MarkAllAsRead()
        {
            try
            {
                var userId = int.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                await _notificationService.MarkAllAsReadAsync(userId);
                await Clients.Caller.SendAsync("AllNotificationsRead");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking all notifications as read");
                throw;
            }
        }

        public async Task GetNotificationHistory(int page = 1, int pageSize = 20)
        {
            try
            {
                var userId = int.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var notifications = await _notificationService.GetNotificationHistoryAsync(userId, page, pageSize);
                await Clients.Caller.SendAsync("NotificationHistory", notifications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting notification history");
                throw;
            }
        }
    }
} 