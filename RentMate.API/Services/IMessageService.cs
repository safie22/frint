using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface IMessageService
    {
        Task<Message> SendMessageAsync(Message message);
        Task<IEnumerable<Message>> GetConversationAsync(int userId1, int userId2);
        Task<bool> MarkMessageAsReadAsync(int messageId);
        Task<int> GetUnreadMessageCountAsync(int userId);
    }
} 