using Microsoft.EntityFrameworkCore;
using RentMate.API.Data;
using RentMate.API.Models;

namespace RentMate.API.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ReportService> _logger;

        public ReportService(ApplicationDbContext context, ILogger<ReportService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Report> CreateReportAsync(Report report)
        {
            try
            {
                _context.Reports.Add(report);
                await _context.SaveChangesAsync();
                return report;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating report");
                throw;
            }
        }

        public async Task<Report?> GetReportByIdAsync(int id)
        {
            return await _context.Reports
                .Include(r => r.Reporter)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Report>> GetReportsByTypeAsync(ReportType type)
        {
            return await _context.Reports
                .Include(r => r.Reporter)
                .Where(r => r.Type == type)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetReportsByStatusAsync(ReportStatus status)
        {
            return await _context.Reports
                .Include(r => r.Reporter)
                .Where(r => r.Status == status)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetReportsByReporterAsync(int reporterId)
        {
            return await _context.Reports
                .Include(r => r.Reporter)
                .Where(r => r.ReporterId == reporterId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Report?> UpdateReportStatusAsync(int id, ReportStatus status)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report != null)
            {
                report.Status = status;
                if (status == ReportStatus.Resolved || status == ReportStatus.Rejected)
                {
                    report.ResolvedAt = DateTime.UtcNow;
                }
                await _context.SaveChangesAsync();
            }
            return report;
        }

        public async Task DeleteReportAsync(int id)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report != null)
            {
                _context.Reports.Remove(report);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetPendingReportsCountAsync()
        {
            return await _context.Reports
                .CountAsync(r => r.Status == ReportStatus.Pending);
        }
    }
} 