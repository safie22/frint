using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface IPaymentService
    {
        Task<Payment> CreatePaymentAsync(Payment payment);
        Task<Payment?> GetPaymentByIdAsync(int id);
        Task<IEnumerable<Payment>> GetPaymentsByPropertyAsync(int propertyId);
        Task<IEnumerable<Payment>> GetPaymentsByTenantAsync(int tenantId);
        Task<IEnumerable<Payment>> GetPaymentsByLandlordAsync(int landlordId);
        Task<Payment?> UpdatePaymentStatusAsync(int id, PaymentStatus status);
        Task<Payment?> ProcessPaymentAsync(int id);
        Task<Payment?> RefundPaymentAsync(int id);
        Task<decimal> GetTotalPaymentsByPropertyAsync(int propertyId);
        Task<decimal> GetTotalPaymentsByTenantAsync(int tenantId);
        Task<decimal> GetTotalPaymentsByLandlordAsync(int landlordId);
    }
} 