using RentMate.API.Models;

namespace RentMate.API.Services;

public interface IAuthService
{
    Task<LoginResult?> LoginAsync(string email, string password);
    Task<User> RegisterAsync(RegisterRequest request);
    Task ApproveUserAsync(int userId);
    Task RejectUserAsync(int userId);
    Task<User?> GetUserByIdAsync(int userId);
    Task<User?> GetUserByEmailAsync(string email);
} 