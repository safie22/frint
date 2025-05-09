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
    public class ProposalController : ControllerBase
    {
        private readonly IProposalService _proposalService;
        private readonly IFileService _fileService;
        private readonly ILogger<ProposalController> _logger;

        public ProposalController(
            IProposalService proposalService,
            IFileService fileService,
            ILogger<ProposalController> logger)
        {
            _proposalService = proposalService;
            _fileService = fileService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateProposal([FromBody] CreateProposalRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var proposal = new Proposal
                {
                    PropertyId = request.PropertyId,
                    TenantId = userId,
                    ProposedRent = request.ProposedRent,
                    StartDate = request.StartDate,
                    EndDate = request.EndDate,
                    Message = request.Message
                };

                var result = await _proposalService.CreateProposalAsync(proposal);
                return CreatedAtAction(nameof(GetProposal), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating proposal");
                return StatusCode(500, new { message = "An error occurred while creating the proposal" });
            }
        }

        [Authorize]
        [HttpPost("{id}/document")]
        public async Task<IActionResult> UploadDocument(int id, IFormFile file)
        {
            try
            {
                var proposal = await _proposalService.GetProposalByIdAsync(id);
                if (proposal == null)
                    return NotFound(new { message = "Proposal not found" });

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                if (proposal.TenantId != userId)
                    return Forbid();

                var filePath = await _fileService.UploadFileAsync(file, "proposals");
                proposal.DocumentPath = filePath;
                await _proposalService.UpdateProposalStatusAsync(id, proposal.Status);

                return Ok(new { filePath });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document for proposal {ProposalId}", id);
                return StatusCode(500, new { message = "An error occurred while uploading the document" });
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProposal(int id)
        {
            try
            {
                var proposal = await _proposalService.GetProposalByIdAsync(id);
                if (proposal == null)
                    return NotFound(new { message = "Proposal not found" });

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                // Only allow access to tenant, landlord, or admin
                if (proposal.TenantId != userId && proposal.Property.LandlordId != userId)
                {
                    var isAdmin = User.IsInRole("Admin");
                    if (!isAdmin)
                        return Forbid();
                }

                return Ok(proposal);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving proposal {ProposalId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the proposal" });
            }
        }

        [Authorize]
        [HttpGet("property/{propertyId}")]
        public async Task<IActionResult> GetPropertyProposals(int propertyId)
        {
            try
            {
                var proposals = await _proposalService.GetProposalsByPropertyIdAsync(propertyId);
                return Ok(proposals);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving proposals for property {PropertyId}", propertyId);
                return StatusCode(500, new { message = "An error occurred while retrieving proposals" });
            }
        }

        [Authorize]
        [HttpGet("tenant")]
        public async Task<IActionResult> GetTenantProposals()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var proposals = await _proposalService.GetProposalsByTenantIdAsync(userId);
                return Ok(proposals);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tenant proposals");
                return StatusCode(500, new { message = "An error occurred while retrieving proposals" });
            }
        }

        [Authorize]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateProposalStatus(int id, [FromBody] UpdateProposalStatusRequest request)
        {
            try
            {
                var proposal = await _proposalService.GetProposalByIdAsync(id);
                if (proposal == null)
                    return NotFound(new { message = "Proposal not found" });

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                // Only landlord or admin can update status
                if (proposal.Property.LandlordId != userId)
                {
                    var isAdmin = User.IsInRole("Admin");
                    if (!isAdmin)
                        return Forbid();
                }

                var result = await _proposalService.UpdateProposalStatusAsync(id, request.Status);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating proposal status {ProposalId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the proposal status" });
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProposal(int id)
        {
            try
            {
                var proposal = await _proposalService.GetProposalByIdAsync(id);
                if (proposal == null)
                    return NotFound(new { message = "Proposal not found" });

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                // Only tenant, landlord, or admin can delete
                if (proposal.TenantId != userId && proposal.Property.LandlordId != userId)
                {
                    var isAdmin = User.IsInRole("Admin");
                    if (!isAdmin)
                        return Forbid();
                }

                await _proposalService.DeleteProposalAsync(id);
                return Ok(new { message = "Proposal deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting proposal {ProposalId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the proposal" });
            }
        }
    }

    public class CreateProposalRequest
    {
        [Required]
        public int PropertyId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal ProposedRent { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(1000)]
        public string Message { get; set; } = string.Empty;
    }

    public class UpdateProposalStatusRequest
    {
        [Required]
        public ProposalStatus Status { get; set; }
    }
} 