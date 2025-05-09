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
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly ILogger<CommentController> _logger;

        public CommentController(ICommentService commentService, ILogger<CommentController> logger)
        {
            _commentService = commentService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var comment = new Comment
                {
                    PropertyId = request.PropertyId,
                    UserId = userId,
                    Content = request.Content
                };

                var result = await _commentService.CreateCommentAsync(comment);
                return CreatedAtAction(nameof(GetComment), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating comment");
                return StatusCode(500, new { message = "An error occurred while creating the comment" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetComment(int id)
        {
            try
            {
                var comment = await _commentService.GetCommentByIdAsync(id);
                if (comment == null)
                    return NotFound(new { message = "Comment not found" });

                return Ok(comment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving comment {CommentId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the comment" });
            }
        }

        [HttpGet("property/{propertyId}")]
        public async Task<IActionResult> GetPropertyComments(int propertyId)
        {
            try
            {
                var comments = await _commentService.GetCommentsByPropertyIdAsync(propertyId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving comments for property {PropertyId}", propertyId);
                return StatusCode(500, new { message = "An error occurred while retrieving comments" });
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var comment = await _commentService.GetCommentByIdAsync(id);
                if (comment == null)
                    return NotFound(new { message = "Comment not found" });

                if (comment.UserId != userId)
                    return Forbid();

                comment.Content = request.Content;
                await _commentService.UpdateCommentAsync(comment);
                return Ok(comment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating comment {CommentId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the comment" });
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                    throw new InvalidOperationException("User ID not found in token"));

                var comment = await _commentService.GetCommentByIdAsync(id);
                if (comment == null)
                    return NotFound(new { message = "Comment not found" });

                if (comment.UserId != userId)
                    return Forbid();

                await _commentService.DeleteCommentAsync(id);
                return Ok(new { message = "Comment deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting comment {CommentId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the comment" });
            }
        }
    }

    public class CreateCommentRequest
    {
        [Required]
        public int PropertyId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;
    }

    public class UpdateCommentRequest
    {
        [Required]
        [MinLength(1)]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;
    }
} 