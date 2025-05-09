using Microsoft.EntityFrameworkCore;
using RentMate.API.Data;
using RentMate.API.Models;

namespace RentMate.API.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PropertyService> _logger;

        public PropertyService(ApplicationDbContext context, ILogger<PropertyService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Property>> GetAllPropertiesAsync()
        {
            return await _context.Properties
                .Include(p => p.Landlord)
                .Include(p => p.Images)
                .Where(p => p.Status == PropertyStatus.Approved)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Property?> GetPropertyByIdAsync(int id)
        {
            return await _context.Properties
                .Include(p => p.Landlord)
                .Include(p => p.Images)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Property> CreatePropertyAsync(Property property)
        {
            _context.Properties.Add(property);
            await _context.SaveChangesAsync();
            return property;
        }

        public async Task UpdatePropertyAsync(Property property)
        {
            property.UpdatedAt = DateTime.UtcNow;
            _context.Properties.Update(property);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePropertyAsync(int id)
        {
            var property = await _context.Properties.FindAsync(id);
            if (property != null)
            {
                _context.Properties.Remove(property);
                await _context.SaveChangesAsync();
            }
        }

        public async Task ApprovePropertyAsync(int id)
        {
            var property = await _context.Properties.FindAsync(id);
            if (property != null)
            {
                property.Status = PropertyStatus.Approved;
                property.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RejectPropertyAsync(int id)
        {
            var property = await _context.Properties.FindAsync(id);
            if (property != null)
            {
                property.Status = PropertyStatus.Rejected;
                property.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task SavePropertyAsync(int propertyId, int userId)
        {
            var savedProperty = new SavedProperty
            {
                PropertyId = propertyId,
                UserId = userId,
                SavedAt = DateTime.UtcNow
            };

            _context.SavedProperties.Add(savedProperty);
            await _context.SaveChangesAsync();
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
                .Include(sp => sp.Property)
                    .ThenInclude(p => p.Landlord)
                .Include(sp => sp.Property)
                    .ThenInclude(p => p.Images)
                .Where(sp => sp.UserId == userId && sp.Property.Status == PropertyStatus.Approved)
                .Select(sp => sp.Property)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task IncrementViewCountAsync(int propertyId)
        {
            var property = await _context.Properties.FindAsync(propertyId);
            if (property != null)
            {
                property.ViewCount++;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Property>> SearchPropertiesAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllPropertiesAsync();

            searchTerm = searchTerm.ToLower();
            return await _context.Properties
                .Include(p => p.Landlord)
                .Include(p => p.Images)
                .Where(p => p.Status == PropertyStatus.Approved &&
                    (p.Title.ToLower().Contains(searchTerm) ||
                     p.Description.ToLower().Contains(searchTerm) ||
                     p.Address.ToLower().Contains(searchTerm)))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
    }
} 