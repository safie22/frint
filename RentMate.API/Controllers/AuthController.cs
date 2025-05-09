using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentMate.API.Models;
using RentMate.API.Services;
using System.ComponentModel.DataAnnotations;

namespace RentMate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = await _authService.LoginAsync(request.Email, request.Password);
                if (result == null)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                return Ok(new { message = "Registration successful. Please wait for admin approval." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Since we're using JWT, we just need to tell the client to discard the token
            return Ok(new { message = "Logged out successfully" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("approve/{userId}")]
        public async Task<IActionResult> ApproveUser(int userId)
        {
            try
            {
                await _authService.ApproveUserAsync(userId);
                return Ok(new { message = "User approved successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving user");
                return StatusCode(500, new { message = "An error occurred while approving user" });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("reject/{userId}")]
        public async Task<IActionResult> RejectUser(int userId)
        {
            try
            {
                await _authService.RejectUserAsync(userId);
                return Ok(new { message = "User rejected successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rejecting user");
                return StatusCode(500, new { message = "An error occurred while rejecting user" });
            }
        }
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
} 