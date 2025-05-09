using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentMate.API.Models;
using RentMate.API.Services;
using System.Security.Claims;

namespace RentMate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyViewController : ControllerBase
    {
        private readonly IPropertyViewService _propertyViewService;
        private readonly ILogger<PropertyViewController> _logger;

        public PropertyViewController(IPropertyViewService propertyViewService, ILogger<PropertyViewController> logger)
        {
            _propertyViewService = propertyViewService;
            _logger = logger;
        }

        [HttpPost("{propertyId}")]
        public async Task<ActionResult> RecordView(int propertyId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
                var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

                await _propertyViewService.RecordViewAsync(
                    propertyId,
                    userId != null ? int.Parse(userId) : null,
                    ipAddress,
                    userAgent
                );

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording property view");
                return StatusCode(500, "An error occurred while recording the property view");
            }
        }

        [HttpGet("{propertyId}/count")]
        public async Task<ActionResult<int>> GetViewCount(int propertyId)
        {
            try
            {
                var count = await _propertyViewService.GetPropertyViewCountAsync(propertyId);
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting property view count");
                return StatusCode(500, "An error occurred while getting the property view count");
            }
        }

        [HttpGet("{propertyId}/count/range")]
        public async Task<ActionResult<int>> GetViewCountInRange(int propertyId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var count = await _propertyViewService.GetPropertyViewCountAsync(propertyId, startDate, endDate);
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting property view count in range");
                return StatusCode(500, "An error occurred while getting the property view count in range");
            }
        }

        [HttpGet("{propertyId}/views")]
        [Authorize(Roles = "Admin,Landlord")]
        public async Task<ActionResult<IEnumerable<PropertyView>>> GetPropertyViews(int propertyId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var views = await _propertyViewService.GetPropertyViewsAsync(propertyId, page, pageSize);
                return Ok(views);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting property views");
                return StatusCode(500, "An error occurred while getting the property views");
            }
        }

        [HttpGet("top")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Dictionary<int, int>>> GetTopViewedProperties([FromQuery] int count = 10)
        {
            try
            {
                var topProperties = await _propertyViewService.GetTopViewedPropertiesAsync(count);
                return Ok(topProperties);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top viewed properties");
                return StatusCode(500, "An error occurred while getting top viewed properties");
            }
        }

        [HttpGet("top/range")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Dictionary<int, int>>> GetTopViewedPropertiesInRange(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate,
            [FromQuery] int count = 10)
        {
            try
            {
                var topProperties = await _propertyViewService.GetTopViewedPropertiesAsync(startDate, endDate, count);
                return Ok(topProperties);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top viewed properties in range");
                return StatusCode(500, "An error occurred while getting top viewed properties in range");
            }
        }
    }
} 