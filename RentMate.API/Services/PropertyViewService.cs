using Microsoft.EntityFrameworkCore;
using RentMate.API.Data;
using RentMate.API.Models;

namespace RentMate.API.Services
{
    public class PropertyViewService : IPropertyViewService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PropertyViewService> _logger;

        public PropertyViewService(ApplicationDbContext context, ILogger<PropertyViewService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<PropertyView> RecordViewAsync(int propertyId, int? userId, string ipAddress, string userAgent)
        {
            try
            {
                var view = new PropertyView
                {
                    PropertyId = propertyId,
                    UserId = userId ?? 0,
                    IPAddress = ipAddress,
                    UserAgent = userAgent,
                    ViewedAt = DateTime.UtcNow
                };

                _context.PropertyViews.Add(view);
                await _context.SaveChangesAsync();
                return view;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording property view");
                throw;
            }
        }

        public async Task<int> GetPropertyViewCountAsync(int propertyId)
        {
            return await _context.PropertyViews
                .CountAsync(v => v.PropertyId == propertyId);
        }

        public async Task<int> GetPropertyViewCountAsync(int propertyId, DateTime startDate, DateTime endDate)
        {
            return await _context.PropertyViews
                .CountAsync(v => v.PropertyId == propertyId && 
                                v.ViewedAt >= startDate && 
                                v.ViewedAt <= endDate);
        }

        public async Task<IEnumerable<PropertyView>> GetPropertyViewsAsync(int propertyId, int page = 1, int pageSize = 20)
        {
            return await _context.PropertyViews
                .Include(v => v.User)
                .Where(v => v.PropertyId == propertyId)
                .OrderByDescending(v => v.ViewedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Dictionary<int, int>> GetTopViewedPropertiesAsync(int count = 10)
        {
            return await _context.PropertyViews
                .GroupBy(v => v.PropertyId)
                .Select(g => new { PropertyId = g.Key, ViewCount = g.Count() })
                .OrderByDescending(x => x.ViewCount)
                .Take(count)
                .ToDictionaryAsync(x => x.PropertyId, x => x.ViewCount);
        }

        public async Task<Dictionary<int, int>> GetTopViewedPropertiesAsync(DateTime startDate, DateTime endDate, int count = 10)
        {
            return await _context.PropertyViews
                .Where(v => v.ViewedAt >= startDate && v.ViewedAt <= endDate)
                .GroupBy(v => v.PropertyId)
                .Select(g => new { PropertyId = g.Key, ViewCount = g.Count() })
                .OrderByDescending(x => x.ViewCount)
                .Take(count)
                .ToDictionaryAsync(x => x.PropertyId, x => x.ViewCount);
        }
    }
} 