using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentMate.API.Models;
using RentMate.API.Services;
using System.Security.Claims;

namespace RentMate.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly ILogger<ReportController> _logger;

        public ReportController(IReportService reportService, ILogger<ReportController> logger)
        {
            _reportService = reportService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<Report>> CreateReport(Report report)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                report.ReporterId = userId;
                var createdReport = await _reportService.CreateReportAsync(report);
                return CreatedAtAction(nameof(GetReport), new { id = createdReport.Id }, createdReport);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating report");
                return StatusCode(500, "An error occurred while creating the report");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Report>> GetReport(int id)
        {
            try
            {
                var report = await _reportService.GetReportByIdAsync(id);
                if (report == null)
                {
                    return NotFound();
                }
                return Ok(report);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting report");
                return StatusCode(500, "An error occurred while getting the report");
            }
        }

        [HttpGet("type/{type}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Report>>> GetReportsByType(ReportType type)
        {
            try
            {
                var reports = await _reportService.GetReportsByTypeAsync(type);
                return Ok(reports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reports by type");
                return StatusCode(500, "An error occurred while getting reports by type");
            }
        }

        [HttpGet("status/{status}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Report>>> GetReportsByStatus(ReportStatus status)
        {
            try
            {
                var reports = await _reportService.GetReportsByStatusAsync(status);
                return Ok(reports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reports by status");
                return StatusCode(500, "An error occurred while getting reports by status");
            }
        }

        [HttpGet("my-reports")]
        public async Task<ActionResult<IEnumerable<Report>>> GetMyReports()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var reports = await _reportService.GetReportsByReporterAsync(userId);
                return Ok(reports);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user's reports");
                return StatusCode(500, "An error occurred while getting user's reports");
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateReportStatus(int id, [FromBody] ReportStatus status)
        {
            try
            {
                var report = await _reportService.UpdateReportStatusAsync(id, status);
                if (report == null)
                {
                    return NotFound();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating report status");
                return StatusCode(500, "An error occurred while updating report status");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteReport(int id)
        {
            try
            {
                await _reportService.DeleteReportAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting report");
                return StatusCode(500, "An error occurred while deleting the report");
            }
        }

        [HttpGet("pending-count")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> GetPendingReportsCount()
        {
            try
            {
                var count = await _reportService.GetPendingReportsCountAsync();
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pending reports count");
                return StatusCode(500, "An error occurred while getting pending reports count");
            }
        }
    }
} 