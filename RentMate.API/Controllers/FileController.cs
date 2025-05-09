using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentMate.API.Services;

namespace RentMate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly ILogger<FileController> _logger;

        public FileController(IFileService fileService, ILogger<FileController> logger)
        {
            _fileService = fileService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromQuery] string directory)
        {
            try
            {
                if (file == null)
                    return BadRequest(new { message = "No file uploaded" });

                var filePath = await _fileService.UploadFileAsync(file, directory);
                return Ok(new { filePath });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(500, new { message = "An error occurred while uploading the file" });
            }
        }

        [Authorize]
        [HttpDelete("{*filePath}")]
        public async Task<IActionResult> DeleteFile(string filePath)
        {
            try
            {
                var result = await _fileService.DeleteFileAsync(filePath);
                if (!result)
                    return NotFound(new { message = "File not found" });

                return Ok(new { message = "File deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file {FilePath}", filePath);
                return StatusCode(500, new { message = "An error occurred while deleting the file" });
            }
        }

        [HttpGet("{*filePath}")]
        public async Task<IActionResult> GetFile(string filePath)
        {
            try
            {
                var fileBytes = await _fileService.GetFileAsync(filePath);
                var extension = Path.GetExtension(filePath).ToLowerInvariant();
                var contentType = extension switch
                {
                    ".jpg" or ".jpeg" => "image/jpeg",
                    ".png" => "image/png",
                    ".pdf" => "application/pdf",
                    ".doc" => "application/msword",
                    ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    _ => "application/octet-stream"
                };

                return File(fileBytes, contentType);
            }
            catch (FileNotFoundException)
            {
                return NotFound(new { message = "File not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving file {FilePath}", filePath);
                return StatusCode(500, new { message = "An error occurred while retrieving the file" });
            }
        }
    }
} 