using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface IPropertyViewService
    {
        Task<PropertyView> RecordViewAsync(int propertyId, int? userId, string ipAddress, string userAgent);
        Task<int> GetPropertyViewCountAsync(int propertyId);
        Task<int> GetPropertyViewCountAsync(int propertyId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<PropertyView>> GetPropertyViewsAsync(int propertyId, int page = 1, int pageSize = 20);
        Task<Dictionary<int, int>> GetTopViewedPropertiesAsync(int count = 10);
        Task<Dictionary<int, int>> GetTopViewedPropertiesAsync(DateTime startDate, DateTime endDate, int count = 10);
    }
} 