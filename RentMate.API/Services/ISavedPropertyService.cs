using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface ISavedPropertyService
    {
        Task<SavedProperty> SavePropertyAsync(int propertyId, int userId);
        Task UnsavePropertyAsync(int propertyId, int userId);
        Task<IEnumerable<Property>> GetSavedPropertiesAsync(int userId);
        Task<bool> IsPropertySavedAsync(int propertyId, int userId);
    }
} 