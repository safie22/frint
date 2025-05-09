using Microsoft.AspNetCore.SignalR;
using RentMate.API.Models;
using RentMate.API.Services;

namespace RentMate.API.Hubs
{
    public class NotificationHub : Hub
    {
        private readonly INotificationService _notificationService;

        public NotificationHub(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task MarkNotificationAsRead(int notificationId)
        {
            await _notificationService.MarkNotificationAsReadAsync(notificationId);
            await Clients.All.SendAsync("NotificationRead", notificationId);
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst("sub")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.User?.FindFirst("sub")?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
} 