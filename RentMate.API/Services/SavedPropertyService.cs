using Microsoft.EntityFrameworkCore;
using RentMate.API.Data;
using RentMate.API.Models;

namespace RentMate.API.Services
{
    public class SavedPropertyService : ISavedPropertyService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<SavedPropertyService> _logger;

        public SavedPropertyService(ApplicationDbContext context, ILogger<SavedPropertyService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<SavedProperty> SavePropertyAsync(int propertyId, int userId)
        {
            // Check if property exists
            var property = await _context.Properties.FindAsync(propertyId);
            if (property == null)
                throw new ArgumentException("Property not found");

            // Check if already saved
            var existing = await _context.SavedProperties
                .FirstOrDefaultAsync(sp => sp.PropertyId == propertyId && sp.UserId == userId);

            if (existing != null)
                return existing;

            var savedProperty = new SavedProperty
            {
                PropertyId = propertyId,
                UserId = userId
            };

            _context.SavedProperties.Add(savedProperty);
            await _context.SaveChangesAsync();
            return savedProperty;
        }

        public async Task UnsavePropertyAsync(int propertyId, int userId)
        {
            var savedProperty = await _context.SavedProperties
                .FirstOrDefaultAsync(sp => sp.PropertyId == propertyId && sp.UserId == userId);

            if (savedProperty != null)
            {
                _context.SavedProperties.Remove(savedProperty);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Property>> GetSavedPropertiesAsync(int userId)
        {
            return await _context.SavedProperties
                .Where(sp => sp.UserId == userId)
                .Include(sp => sp.Property)
                    .ThenInclude(p => p.Landlord)
                .OrderByDescending(sp => sp.SavedAt)
                .Select(sp => sp.Property)
                .ToListAsync();
        }

        public async Task<bool> IsPropertySavedAsync(int propertyId, int userId)
        {
            return await _context.SavedProperties
                .AnyAsync(sp => sp.PropertyId == propertyId && sp.UserId == userId);
        }
    }
} 