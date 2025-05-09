using Microsoft.EntityFrameworkCore;
using RentMate.API.Models;

namespace RentMate.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<PropertyImage> PropertyImages { get; set; }
        public DbSet<SavedProperty> SavedProperties { get; set; }
        public DbSet<Proposal> Proposals { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure decimal properties
            modelBuilder.Entity<Property>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Property>()
                .Property(p => p.Area)
                .HasColumnType("decimal(18,2)");

            // User relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.Properties)
                .WithOne(p => p.Landlord)
                .HasForeignKey(p => p.LandlordId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.SavedProperties)
                .WithOne(sp => sp.User)
                .HasForeignKey(sp => sp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Proposals)
                .WithOne(p => p.Tenant)
                .HasForeignKey(p => p.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.SentMessages)
                .WithOne(m => m.Sender)
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.ReceivedMessages)
                .WithOne(m => m.Receiver)
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Notifications)
                .WithOne(n => n.User)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Property relationships
            modelBuilder.Entity<Property>()
                .HasMany(p => p.Images)
                .WithOne(pi => pi.Property)
                .HasForeignKey(pi => pi.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Property>()
                .HasMany(p => p.SavedByUsers)
                .WithOne(sp => sp.Property)
                .HasForeignKey(sp => sp.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Property>()
                .HasMany(p => p.Proposals)
                .WithOne(pr => pr.Property)
                .HasForeignKey(pr => pr.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Property>()
                .HasMany(p => p.Comments)
                .WithOne(c => c.Property)
                .HasForeignKey(c => c.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            // SavedProperty relationships
            modelBuilder.Entity<SavedProperty>()
                .HasKey(sp => new { sp.UserId, sp.PropertyId });

            // Comment relationships
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
} 