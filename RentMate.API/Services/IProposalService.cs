using RentMate.API.Models;

namespace RentMate.API.Services
{
    public interface IProposalService
    {
        Task<Proposal> CreateProposalAsync(Proposal proposal, IFormFile file = null);
        Task<Proposal> GetProposalByIdAsync(int id);
        Task<IEnumerable<Proposal>> GetProposalsByPropertyIdAsync(int propertyId);
        Task<IEnumerable<Proposal>> GetProposalsByTenantIdAsync(int tenantId);
        Task<bool> AcceptProposalAsync(int id);
        Task<bool> RejectProposalAsync(int id);
        Task<bool> DeleteProposalAsync(int id);
    }
} 