using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface ICommentService
    {
        Task<Comment> CreateCommentAsync(Comment comment);
        Task<Comment?> GetCommentByIdAsync(int id);
        Task<IEnumerable<Comment>> GetCommentsByPropertyIdAsync(int propertyId);
        Task<Comment> UpdateCommentAsync(Comment comment);
        Task DeleteCommentAsync(int id);
    }
} 