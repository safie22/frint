using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface IChatService
    {
        Task<ChatMessage> SaveMessageAsync(ChatMessage message);
        Task<ChatMessage?> GetMessageByIdAsync(int id);
        Task<IEnumerable<ChatMessage>> GetUnreadMessagesAsync(int userId);
        Task<IEnumerable<ChatMessage>> GetChatHistoryAsync(int userId1, int userId2);
        Task<ChatMessage?> MarkMessageAsReadAsync(int messageId, int userId);
        Task DeleteMessageAsync(int messageId);
    }
} 