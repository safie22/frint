using Microsoft.EntityFrameworkCore;
using RentMate.API.Data;
using RentMate.API.Models;

namespace RentMate.API.Services
{
    public class ProposalService : IProposalService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProposalService> _logger;

        public ProposalService(ApplicationDbContext context, ILogger<ProposalService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Proposal> CreateProposalAsync(Proposal proposal)
        {
            try
            {
                var property = await _context.Properties
                    .FirstOrDefaultAsync(p => p.Id == proposal.PropertyId);

                if (property == null)
                    throw new ArgumentException("Property not found");

                if (property.Status != PropertyStatus.Available)
                    throw new ArgumentException("Property is not available for proposals");

                proposal.Status = ProposalStatus.Pending;
                _context.Proposals.Add(proposal);
                await _context.SaveChangesAsync();
                return proposal;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating proposal");
                throw;
            }
        }

        public async Task<Proposal?> GetProposalByIdAsync(int id)
        {
            return await _context.Proposals
                .Include(p => p.Property)
                .Include(p => p.Tenant)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Proposal>> GetProposalsByPropertyIdAsync(int propertyId)
        {
            return await _context.Proposals
                .Include(p => p.Tenant)
                .Where(p => p.PropertyId == propertyId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Proposal>> GetProposalsByTenantIdAsync(int tenantId)
        {
            return await _context.Proposals
                .Include(p => p.Property)
                .Where(p => p.TenantId == tenantId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Proposal> UpdateProposalStatusAsync(int id, ProposalStatus status)
        {
            try
            {
                var proposal = await _context.Proposals
                    .Include(p => p.Property)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (proposal == null)
                    throw new ArgumentException("Proposal not found");

                proposal.Status = status;

                if (status == ProposalStatus.Accepted)
                {
                    proposal.Property.Status = PropertyStatus.Rented;
                    proposal.Property.UpdatedAt = DateTime.UtcNow;
                    proposal.Property.RentedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                return proposal;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating proposal status");
                throw;
            }
        }

        public async Task DeleteProposalAsync(int id)
        {
            var proposal = await _context.Proposals.FindAsync(id);
            if (proposal != null)
            {
                _context.Proposals.Remove(proposal);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> HasActiveProposalAsync(int propertyId, int tenantId)
        {
            return await _context.Proposals
                .AnyAsync(p => p.PropertyId == propertyId && 
                              p.TenantId == tenantId && 
                              p.Status == ProposalStatus.Pending);
        }
    }
} 