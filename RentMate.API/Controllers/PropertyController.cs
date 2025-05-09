using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentMate.API.Models;
using RentMate.API.Services;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace RentMate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly ILogger<PropertyController> _logger;

        public PropertyController(IPropertyService propertyService, ILogger<PropertyController> logger)
        {
            _propertyService = propertyService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProperties()
        {
            try
            {
                var properties = await _propertyService.GetAllPropertiesAsync();
                return Ok(properties);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all properties");
                return StatusCode(500, new { message = "An error occurred while retrieving properties" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProperty(int id)
        {
            try
            {
                var property = await _propertyService.GetPropertyByIdAsync(id);
                if (property == null)
                    return NotFound(new { message = "Property not found" });

                await _propertyService.IncrementViewCountAsync(id);
                return Ok(property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving property {PropertyId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the property" });
            }
        }

        [Authorize(Roles = "Landlord")]
        [HttpPost]
        public async Task<IActionResult> CreateProperty([FromBody] CreatePropertyRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var property = new Property
                {
                    Title = request.Title,
                    Description = request.Description,
                    Address = request.Address,
                    Price = request.Price,
                    Bedrooms = request.Bedrooms,
                    Bathrooms = request.Bathrooms,
                    Area = request.Area,
                    LandlordId = userId,
                    Status = PropertyStatus.Pending
                };

                await _propertyService.CreatePropertyAsync(property);
                return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating property");
                return StatusCode(500, new { message = "An error occurred while creating the property" });
            }
        }

        [Authorize(Roles = "Landlord")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProperty(int id, [FromBody] UpdatePropertyRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var property = await _propertyService.GetPropertyByIdAsync(id);
                if (property == null)
                    return NotFound(new { message = "Property not found" });

                if (property.LandlordId != userId)
                    return Forbid();

                property.Title = request.Title;
                property.Description = request.Description;
                property.Address = request.Address;
                property.Price = request.Price;
                property.Bedrooms = request.Bedrooms;
                property.Bathrooms = request.Bathrooms;
                property.Area = request.Area;
                property.UpdatedAt = DateTime.UtcNow;

                await _propertyService.UpdatePropertyAsync(property);
                return Ok(property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating property {PropertyId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the property" });
            }
        }

        [Authorize(Roles = "Landlord")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var property = await _propertyService.GetPropertyByIdAsync(id);
                if (property == null)
                    return NotFound(new { message = "Property not found" });

                if (property.LandlordId != userId)
                    return Forbid();

                await _propertyService.DeletePropertyAsync(id);
                return Ok(new { message = "Property deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting property {PropertyId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the property" });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveProperty(int id)
        {
            try
            {
                var property = await _propertyService.GetPropertyByIdAsync(id);
                if (property == null)
                    return NotFound(new { message = "Property not found" });

                await _propertyService.ApprovePropertyAsync(id);
                return Ok(new { message = "Property approved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving property {PropertyId}", id);
                return StatusCode(500, new { message = "An error occurred while approving the property" });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectProperty(int id)
        {
            try
            {
                var property = await _propertyService.GetPropertyByIdAsync(id);
                if (property == null)
                    return NotFound(new { message = "Property not found" });

                await _propertyService.RejectPropertyAsync(id);
                return Ok(new { message = "Property rejected successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rejecting property {PropertyId}", id);
                return StatusCode(500, new { message = "An error occurred while rejecting the property" });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProperties([FromQuery] string searchTerm)
        {
            try
            {
                var properties = await _propertyService.SearchPropertiesAsync(searchTerm);
                return Ok(properties);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching properties with term {SearchTerm}", searchTerm);
                return StatusCode(500, new { message = "An error occurred while searching properties" });
            }
        }
    }

    public class CreatePropertyRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int Bedrooms { get; set; }

        [Range(0, int.MaxValue)]
        public int Bathrooms { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Area { get; set; }
    }

    public class UpdatePropertyRequest : CreatePropertyRequest
    {
    }
} 