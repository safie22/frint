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
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IPaymentService paymentService, ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<Payment>> CreatePayment(Payment payment)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                payment.TenantId = userId;
                var createdPayment = await _paymentService.CreatePaymentAsync(payment);
                return CreatedAtAction(nameof(GetPayment), new { id = createdPayment.Id }, createdPayment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment");
                return StatusCode(500, "An error occurred while creating the payment");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            try
            {
                var payment = await _paymentService.GetPaymentByIdAsync(id);
                if (payment == null)
                {
                    return NotFound();
                }

                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                if (payment.TenantId != userId && payment.LandlordId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                return Ok(payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment");
                return StatusCode(500, "An error occurred while getting the payment");
            }
        }

        [HttpGet("property/{propertyId}")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPaymentsByProperty(int propertyId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var payments = await _paymentService.GetPaymentsByPropertyAsync(propertyId);
                var filteredPayments = payments.Where(p => p.TenantId == userId || p.LandlordId == userId || User.IsInRole("Admin"));
                return Ok(filteredPayments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payments by property");
                return StatusCode(500, "An error occurred while getting payments by property");
            }
        }

        [HttpGet("my-payments")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetMyPayments()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var payments = await _paymentService.GetPaymentsByTenantAsync(userId);
                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user's payments");
                return StatusCode(500, "An error occurred while getting user's payments");
            }
        }

        [HttpGet("landlord-payments")]
        [Authorize(Roles = "Landlord")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetLandlordPayments()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var payments = await _paymentService.GetPaymentsByLandlordAsync(userId);
                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting landlord's payments");
                return StatusCode(500, "An error occurred while getting landlord's payments");
            }
        }

        [HttpPost("{id}/process")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> ProcessPayment(int id)
        {
            try
            {
                var payment = await _paymentService.ProcessPaymentAsync(id);
                if (payment == null)
                {
                    return NotFound();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment");
                return StatusCode(500, "An error occurred while processing the payment");
            }
        }

        [HttpPost("{id}/refund")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> RefundPayment(int id)
        {
            try
            {
                var payment = await _paymentService.RefundPaymentAsync(id);
                if (payment == null)
                {
                    return NotFound();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refunding payment");
                return StatusCode(500, "An error occurred while refunding the payment");
            }
        }

        [HttpGet("property/{propertyId}/total")]
        public async Task<ActionResult<decimal>> GetTotalPaymentsByProperty(int propertyId)
        {
            try
            {
                var total = await _paymentService.GetTotalPaymentsByPropertyAsync(propertyId);
                return Ok(total);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total payments by property");
                return StatusCode(500, "An error occurred while getting total payments by property");
            }
        }

        [HttpGet("tenant/{tenantId}/total")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<decimal>> GetTotalPaymentsByTenant(int tenantId)
        {
            try
            {
                var total = await _paymentService.GetTotalPaymentsByTenantAsync(tenantId);
                return Ok(total);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total payments by tenant");
                return StatusCode(500, "An error occurred while getting total payments by tenant");
            }
        }

        [HttpGet("landlord/{landlordId}/total")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<decimal>> GetTotalPaymentsByLandlord(int landlordId)
        {
            try
            {
                var total = await _paymentService.GetTotalPaymentsByLandlordAsync(landlordId);
                return Ok(total);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total payments by landlord");
                return StatusCode(500, "An error occurred while getting total payments by landlord");
            }
        }
    }
} 