using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface IContractService
    {
        Task<Contract> CreateContractAsync(Contract contract);
        Task<Contract?> GetContractByIdAsync(int id);
        Task<IEnumerable<Contract>> GetContractsByPropertyAsync(int propertyId);
        Task<IEnumerable<Contract>> GetContractsByTenantAsync(int tenantId);
        Task<IEnumerable<Contract>> GetContractsByLandlordAsync(int landlordId);
        Task<Contract?> UpdateContractAsync(Contract contract);
        Task<Contract?> SignContractAsync(int id, int userId);
        Task<Contract?> TerminateContractAsync(int id);
        Task<Contract?> RenewContractAsync(int id, DateTime newEndDate);
        Task<bool> IsPropertyAvailableAsync(int propertyId, DateTime startDate, DateTime endDate);
    }
} 