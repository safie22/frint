using Microsoft.EntityFrameworkCore;
using RentMate.API.Data;
using RentMate.API.Models;

namespace RentMate.API.Services
{
    public class ContractService : IContractService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ContractService> _logger;

        public ContractService(ApplicationDbContext context, ILogger<ContractService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Contract> CreateContractAsync(Contract contract)
        {
            try
            {
                contract.Status = ContractStatus.Draft;
                _context.Contracts.Add(contract);
                await _context.SaveChangesAsync();
                return contract;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating contract");
                throw;
            }
        }

        public async Task<Contract?> GetContractByIdAsync(int id)
        {
            return await _context.Contracts
                .Include(c => c.Property)
                .Include(c => c.Tenant)
                .Include(c => c.Landlord)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Contract>> GetContractsByPropertyAsync(int propertyId)
        {
            return await _context.Contracts
                .Include(c => c.Tenant)
                .Include(c => c.Landlord)
                .Where(c => c.PropertyId == propertyId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Contract>> GetContractsByTenantAsync(int tenantId)
        {
            return await _context.Contracts
                .Include(c => c.Property)
                .Include(c => c.Landlord)
                .Where(c => c.TenantId == tenantId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Contract>> GetContractsByLandlordAsync(int landlordId)
        {
            return await _context.Contracts
                .Include(c => c.Property)
                .Include(c => c.Tenant)
                .Where(c => c.LandlordId == landlordId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Contract?> UpdateContractAsync(Contract contract)
        {
            var existingContract = await _context.Contracts.FindAsync(contract.Id);
            if (existingContract != null)
            {
                if (existingContract.Status != ContractStatus.Draft)
                {
                    throw new InvalidOperationException("Cannot update a contract that is not in draft status");
                }

                _context.Entry(existingContract).CurrentValues.SetValues(contract);
                await _context.SaveChangesAsync();
            }
            return existingContract;
        }

        public async Task<Contract?> SignContractAsync(int id, int userId)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract != null)
            {
                if (contract.Status != ContractStatus.Draft && contract.Status != ContractStatus.Pending)
                {
                    throw new InvalidOperationException("Contract cannot be signed in its current status");
                }

                if (userId != contract.TenantId && userId != contract.LandlordId)
                {
                    throw new InvalidOperationException("User is not authorized to sign this contract");
                }

                contract.SignedAt = DateTime.UtcNow;
                contract.Status = ContractStatus.Active;
                await _context.SaveChangesAsync();
            }
            return contract;
        }

        public async Task<Contract?> TerminateContractAsync(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract != null)
            {
                if (contract.Status != ContractStatus.Active)
                {
                    throw new InvalidOperationException("Only active contracts can be terminated");
                }

                contract.Status = ContractStatus.Terminated;
                contract.TerminatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            return contract;
        }

        public async Task<Contract?> RenewContractAsync(int id, DateTime newEndDate)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract != null)
            {
                if (contract.Status != ContractStatus.Active && contract.Status != ContractStatus.Expired)
                {
                    throw new InvalidOperationException("Contract cannot be renewed in its current status");
                }

                contract.EndDate = newEndDate;
                contract.Status = ContractStatus.Active;
                await _context.SaveChangesAsync();
            }
            return contract;
        }

        public async Task<bool> IsPropertyAvailableAsync(int propertyId, DateTime startDate, DateTime endDate)
        {
            var overlappingContracts = await _context.Contracts
                .Where(c => c.PropertyId == propertyId &&
                           c.Status == ContractStatus.Active &&
                           ((c.StartDate <= startDate && c.EndDate >= startDate) ||
                            (c.StartDate <= endDate && c.EndDate >= endDate) ||
                            (c.StartDate >= startDate && c.EndDate <= endDate)))
                .AnyAsync();

            return !overlappingContracts;
        }
    }
} 