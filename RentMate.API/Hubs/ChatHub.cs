using Microsoft.AspNetCore.SignalR;
using RentMate.API.Models;
using RentMate.API.Services;

namespace RentMate.API.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IMessageService _messageService;
        private readonly INotificationService _notificationService;

        public ChatHub(IMessageService messageService, INotificationService notificationService)
        {
            _messageService = messageService;
            _notificationService = notificationService;
        }

        public async Task SendMessage(Message message)
        {
            var savedMessage = await _messageService.SendMessageAsync(message);
            await Clients.User(message.ReceiverId.ToString()).SendAsync("ReceiveMessage", savedMessage);

            // Create notification for the receiver
            var notification = new Notification
            {
                UserId = message.ReceiverId,
                Message = $"New message from {message.Sender.FirstName}",
                Type = NotificationType.NewMessage,
                CreatedAt = DateTime.UtcNow,
                RelatedEntityId = savedMessage.Id
            };

            await _notificationService.CreateNotificationAsync(notification);
            await Clients.User(message.ReceiverId.ToString()).SendAsync("ReceiveNotification", notification);
        }

        public async Task MarkMessageAsRead(int messageId)
        {
            await _messageService.MarkMessageAsReadAsync(messageId);
            await Clients.All.SendAsync("MessageRead", messageId);
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