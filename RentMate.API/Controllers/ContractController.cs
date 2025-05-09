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
    public class ContractController : ControllerBase
    {
        private readonly IContractService _contractService;
        private readonly ILogger<ContractController> _logger;

        public ContractController(IContractService contractService, ILogger<ContractController> logger)
        {
            _contractService = contractService;
            _logger = logger;
        }

        [HttpPost]
        [Authorize(Roles = "Landlord")]
        public async Task<ActionResult<Contract>> CreateContract(Contract contract)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                contract.LandlordId = userId;
                var createdContract = await _contractService.CreateContractAsync(contract);
                return CreatedAtAction(nameof(GetContract), new { id = createdContract.Id }, createdContract);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating contract");
                return StatusCode(500, "An error occurred while creating the contract");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Contract>> GetContract(int id)
        {
            try
            {
                var contract = await _contractService.GetContractByIdAsync(id);
                if (contract == null)
                {
                    return NotFound();
                }

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                if (contract.TenantId != userId && contract.LandlordId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                return Ok(contract);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting contract");
                return StatusCode(500, "An error occurred while getting the contract");
            }
        }

        [HttpGet("property/{propertyId}")]
        public async Task<ActionResult<IEnumerable<Contract>>> GetContractsByProperty(int propertyId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var contracts = await _contractService.GetContractsByPropertyAsync(propertyId);
                var filteredContracts = contracts.Where(c => c.TenantId == userId || c.LandlordId == userId || User.IsInRole("Admin"));
                return Ok(filteredContracts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting contracts by property");
                return StatusCode(500, "An error occurred while getting contracts by property");
            }
        }

        [HttpGet("my-contracts")]
        public async Task<ActionResult<IEnumerable<Contract>>> GetMyContracts()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var contracts = await _contractService.GetContractsByTenantAsync(userId);
                return Ok(contracts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user's contracts");
                return StatusCode(500, "An error occurred while getting user's contracts");
            }
        }

        [HttpGet("landlord-contracts")]
        [Authorize(Roles = "Landlord")]
        public async Task<ActionResult<IEnumerable<Contract>>> GetLandlordContracts()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var contracts = await _contractService.GetContractsByLandlordAsync(userId);
                return Ok(contracts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting landlord's contracts");
                return StatusCode(500, "An error occurred while getting landlord's contracts");
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Landlord")]
        public async Task<ActionResult> UpdateContract(int id, Contract contract)
        {
            try
            {
                if (id != contract.Id)
                {
                    return BadRequest();
                }

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                if (contract.LandlordId != userId)
                {
                    return Forbid();
                }

                var updatedContract = await _contractService.UpdateContractAsync(contract);
                if (updatedContract == null)
                {
                    return NotFound();
                }

                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating contract");
                return StatusCode(500, "An error occurred while updating the contract");
            }
        }

        [HttpPost("{id}/sign")]
        public async Task<ActionResult> SignContract(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var contract = await _contractService.SignContractAsync(id, userId);
                if (contract == null)
                {
                    return NotFound();
                }

                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error signing contract");
                return StatusCode(500, "An error occurred while signing the contract");
            }
        }

        [HttpPost("{id}/terminate")]
        [Authorize(Roles = "Landlord,Admin")]
        public async Task<ActionResult> TerminateContract(int id)
        {
            try
            {
                var contract = await _contractService.TerminateContractAsync(id);
                if (contract == null)
                {
                    return NotFound();
                }

                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error terminating contract");
                return StatusCode(500, "An error occurred while terminating the contract");
            }
        }

        [HttpPost("{id}/renew")]
        [Authorize(Roles = "Landlord")]
        public async Task<ActionResult> RenewContract(int id, [FromBody] DateTime newEndDate)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var contract = await _contractService.GetContractByIdAsync(id);
                if (contract == null)
                {
                    return NotFound();
                }

                if (contract.LandlordId != userId)
                {
                    return Forbid();
                }

                var renewedContract = await _contractService.RenewContractAsync(id, newEndDate);
                if (renewedContract == null)
                {
                    return NotFound();
                }

                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error renewing contract");
                return StatusCode(500, "An error occurred while renewing the contract");
            }
        }

        [HttpGet("property/{propertyId}/availability")]
        public async Task<ActionResult<bool>> CheckPropertyAvailability(int propertyId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var isAvailable = await _contractService.IsPropertyAvailableAsync(propertyId, startDate, endDate);
                return Ok(isAvailable);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking property availability");
                return StatusCode(500, "An error occurred while checking property availability");
            }
        }
    }
} 