using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface IProposalService
    {
        Task<Proposal> CreateProposalAsync(Proposal proposal);
        Task<Proposal?> GetProposalByIdAsync(int id);
        Task<IEnumerable<Proposal>> GetProposalsByPropertyIdAsync(int propertyId);
        Task<IEnumerable<Proposal>> GetProposalsByTenantIdAsync(int tenantId);
        Task<Proposal> UpdateProposalStatusAsync(int id, ProposalStatus status);
        Task DeleteProposalAsync(int id);
        Task<bool> HasActiveProposalAsync(int propertyId, int tenantId);
    }
} 