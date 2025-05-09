using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string directory);
        Task<bool> DeleteFileAsync(string filePath);
        Task<byte[]> GetFileAsync(string filePath);
    }

    public class FileService : IFileService
    {
        private readonly string _basePath;
        private readonly string[] _allowedExtensions;
        private readonly long _maxFileSize;
        private readonly ILogger<FileService> _logger;

        public FileService(IConfiguration configuration, ILogger<FileService> logger)
        {
            _basePath = configuration["FileStorage:BasePath"] ?? "uploads";
            _allowedExtensions = (configuration["FileStorage:AllowedExtensions"] ?? "jpg,jpeg,png,pdf").Split(',');
            _maxFileSize = long.Parse(configuration["FileStorage:MaxFileSize"] ?? "10485760"); // 10MB default
            _logger = logger;

            if (!Directory.Exists(_basePath))
            {
                Directory.CreateDirectory(_basePath);
            }
        }

        public async Task<string> UploadFileAsync(IFormFile file, string directory)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded");

            if (file.Length > _maxFileSize)
                throw new ArgumentException($"File size exceeds the maximum limit of {_maxFileSize / 1024 / 1024}MB");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
                throw new ArgumentException($"File type not allowed. Allowed types: {string.Join(", ", _allowedExtensions)}");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var directoryPath = Path.Combine(_basePath, directory);
            var filePath = Path.Combine(directoryPath, fileName);

            Directory.CreateDirectory(directoryPath);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"{directory}/{fileName}";
        }

        public async Task<bool> DeleteFileAsync(string filePath)
        {
            var fullPath = Path.Combine(_basePath, filePath);
            if (!File.Exists(fullPath))
                return false;

            try
            {
                await Task.Run(() => File.Delete(fullPath));
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<byte[]> GetFileAsync(string filePath)
        {
            var fullPath = Path.Combine(_basePath, filePath);
            if (!File.Exists(fullPath))
                throw new FileNotFoundException("File not found", filePath);

            return await File.ReadAllBytesAsync(fullPath);
        }
    }
} 