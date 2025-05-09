namespace RentMate.API.Services
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string directory);
        Task<bool> DeleteFileAsync(string filePath);
        Task<byte[]> GetFileAsync(string filePath);
    }
} 