using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface IPropertyService
    {
        Task<IEnumerable<Property>> GetAllPropertiesAsync();
        Task<Property?> GetPropertyByIdAsync(int id);
        Task<IEnumerable<Property>> SearchPropertiesAsync(string searchTerm);
        Task<Property> CreatePropertyAsync(Property property);
        Task UpdatePropertyAsync(Property property);
        Task DeletePropertyAsync(int id);
        Task ApprovePropertyAsync(int id);
        Task RejectPropertyAsync(int id);
        Task SavePropertyAsync(int propertyId, int userId);
        Task UnsavePropertyAsync(int propertyId, int userId);
        Task<IEnumerable<Property>> GetSavedPropertiesAsync(int userId);
        Task IncrementViewCountAsync(int propertyId);
    }
} 