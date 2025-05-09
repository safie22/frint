using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using RentMate.API.Models;
using RentMate.API.Services;
using System.Security.Claims;

namespace RentMate.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(IChatService chatService, ILogger<ChatHub> logger)
        {
            _chatService = chatService;
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

        public async Task SendMessage(int receiverId, string message)
        {
            try
            {
                var senderId = int.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var chatMessage = new ChatMessage
                {
                    SenderId = senderId,
                    ReceiverId = receiverId,
                    Content = message,
                    SentAt = DateTime.UtcNow
                };

                await _chatService.SaveMessageAsync(chatMessage);

                // Send to receiver
                await Clients.Group($"user_{receiverId}").SendAsync("ReceiveMessage", new
                {
                    chatMessage.Id,
                    chatMessage.SenderId,
                    chatMessage.ReceiverId,
                    chatMessage.Content,
                    chatMessage.SentAt,
                    IsRead = false
                });

                // Send confirmation to sender
                await Clients.Caller.SendAsync("MessageSent", new
                {
                    chatMessage.Id,
                    chatMessage.SenderId,
                    chatMessage.ReceiverId,
                    chatMessage.Content,
                    chatMessage.SentAt,
                    IsRead = false
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message");
                throw;
            }
        }

        public async Task MarkAsRead(int messageId)
        {
            try
            {
                var userId = int.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var message = await _chatService.MarkMessageAsReadAsync(messageId, userId);
                if (message != null)
                {
                    await Clients.Group($"user_{message.SenderId}").SendAsync("MessageRead", messageId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking message as read");
                throw;
            }
        }

        public async Task GetUnreadMessages()
        {
            try
            {
                var userId = int.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var messages = await _chatService.GetUnreadMessagesAsync(userId);
                await Clients.Caller.SendAsync("UnreadMessages", messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting unread messages");
                throw;
            }
        }

        public async Task GetChatHistory(int otherUserId)
        {
            try
            {
                var userId = int.Parse(Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var messages = await _chatService.GetChatHistoryAsync(userId, otherUserId);
                await Clients.Caller.SendAsync("ChatHistory", messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting chat history");
                throw;
            }
        }
    }
} 