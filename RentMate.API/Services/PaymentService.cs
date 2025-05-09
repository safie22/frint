using Microsoft.EntityFrameworkCore;
using RentMate.API.Data;
using RentMate.API.Models;

namespace RentMate.API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(ApplicationDbContext context, ILogger<PaymentService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Payment> CreatePaymentAsync(Payment payment)
        {
            try
            {
                payment.Status = PaymentStatus.Pending;
                payment.TransactionId = Guid.NewGuid().ToString();
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();
                return payment;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payment");
                throw;
            }
        }

        public async Task<Payment?> GetPaymentByIdAsync(int id)
        {
            return await _context.Payments
                .Include(p => p.Property)
                .Include(p => p.Tenant)
                .Include(p => p.Landlord)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Payment>> GetPaymentsByPropertyAsync(int propertyId)
        {
            return await _context.Payments
                .Include(p => p.Tenant)
                .Include(p => p.Landlord)
                .Where(p => p.PropertyId == propertyId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Payment>> GetPaymentsByTenantAsync(int tenantId)
        {
            return await _context.Payments
                .Include(p => p.Property)
                .Include(p => p.Landlord)
                .Where(p => p.TenantId == tenantId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Payment>> GetPaymentsByLandlordAsync(int landlordId)
        {
            return await _context.Payments
                .Include(p => p.Property)
                .Include(p => p.Tenant)
                .Where(p => p.LandlordId == landlordId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Payment?> UpdatePaymentStatusAsync(int id, PaymentStatus status)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment != null)
            {
                payment.Status = status;
                if (status == PaymentStatus.Completed)
                {
                    payment.CompletedAt = DateTime.UtcNow;
                }
                await _context.SaveChangesAsync();
            }
            return payment;
        }

        public async Task<Payment?> ProcessPaymentAsync(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment != null && payment.Status == PaymentStatus.Pending)
            {
                try
                {
                    // Here you would integrate with a payment gateway
                    // For now, we'll just simulate a successful payment
                    payment.Status = PaymentStatus.Completed;
                    payment.CompletedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing payment");
                    payment.Status = PaymentStatus.Failed;
                    await _context.SaveChangesAsync();
                    throw;
                }
            }
            return payment;
        }

        public async Task<Payment?> RefundPaymentAsync(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment != null && payment.Status == PaymentStatus.Completed)
            {
                try
                {
                    // Here you would integrate with a payment gateway for refund
                    // For now, we'll just simulate a successful refund
                    payment.Status = PaymentStatus.Refunded;
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error refunding payment");
                    throw;
                }
            }
            return payment;
        }

        public async Task<decimal> GetTotalPaymentsByPropertyAsync(int propertyId)
        {
            return await _context.Payments
                .Where(p => p.PropertyId == propertyId && p.Status == PaymentStatus.Completed)
                .SumAsync(p => p.Amount);
        }

        public async Task<decimal> GetTotalPaymentsByTenantAsync(int tenantId)
        {
            return await _context.Payments
                .Where(p => p.TenantId == tenantId && p.Status == PaymentStatus.Completed)
                .SumAsync(p => p.Amount);
        }

        public async Task<decimal> GetTotalPaymentsByLandlordAsync(int landlordId)
        {
            return await _context.Payments
                .Where(p => p.LandlordId == landlordId && p.Status == PaymentStatus.Completed)
                .SumAsync(p => p.Amount);
        }
    }
} 