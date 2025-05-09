using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface IReportService
    {
        Task<Report> CreateReportAsync(Report report);
        Task<Report?> GetReportByIdAsync(int id);
        Task<IEnumerable<Report>> GetReportsByTypeAsync(ReportType type);
        Task<IEnumerable<Report>> GetReportsByStatusAsync(ReportStatus status);
        Task<IEnumerable<Report>> GetReportsByReporterAsync(int reporterId);
        Task<Report?> UpdateReportStatusAsync(int id, ReportStatus status);
        Task DeleteReportAsync(int id);
        Task<int> GetPendingReportsCountAsync();
    }
} 