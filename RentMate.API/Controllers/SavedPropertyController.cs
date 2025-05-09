using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentMate.API.Services;
using System.Security.Claims;

namespace RentMate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SavedPropertyController : ControllerBase
    {
        private readonly ISavedPropertyService _savedPropertyService;
        private readonly ILogger<SavedPropertyController> _logger;

        public SavedPropertyController(
            ISavedPropertyService savedPropertyService,
            ILogger<SavedPropertyController> logger)
        {
            _savedPropertyService = savedPropertyService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("{propertyId}")]
        public async Task<IActionResult> SaveProperty(int propertyId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var result = await _savedPropertyService.SavePropertyAsync(propertyId, userId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving property {PropertyId}", propertyId);
                return StatusCode(500, new { message = "An error occurred while saving the property" });
            }
        }

        [Authorize]
        [HttpDelete("{propertyId}")]
        public async Task<IActionResult> UnsaveProperty(int propertyId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                await _savedPropertyService.UnsavePropertyAsync(propertyId, userId);
                return Ok(new { message = "Property unsaved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error unsaving property {PropertyId}", propertyId);
                return StatusCode(500, new { message = "An error occurred while unsaving the property" });
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetSavedProperties()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var properties = await _savedPropertyService.GetSavedPropertiesAsync(userId);
                return Ok(properties);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving saved properties");
                return StatusCode(500, new { message = "An error occurred while retrieving saved properties" });
            }
        }

        [Authorize]
        [HttpGet("{propertyId}/status")]
        public async Task<IActionResult> GetPropertySavedStatus(int propertyId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var isSaved = await _savedPropertyService.IsPropertySavedAsync(propertyId, userId);
                return Ok(new { isSaved });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking property saved status {PropertyId}", propertyId);
                return StatusCode(500, new { message = "An error occurred while checking property saved status" });
            }
        }
    }
} 