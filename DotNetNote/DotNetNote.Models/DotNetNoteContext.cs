﻿// System.Data.SqlClient.dll
// Microsoft.EntityFrameworkCore.SqlServer.dll
// System.Configuration.ConfigurationManager.dll 
using Microsoft.EntityFrameworkCore;
using System.Configuration;

namespace DotNetNote.Models
{
    public class DotNetNoteContext : DbContext
    {
        public DotNetNoteContext()
        {
            // Empty
        }

        public DotNetNoteContext(DbContextOptions<DotNetNoteContext> options)
            : base(options)
        {
            // 공식과 같은 코드 
        }

        protected override void OnConfiguring(
            DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                string connectionString = ConfigurationManager.ConnectionStrings[
                    "ConnectionString"].ConnectionString;
                optionsBuilder.UseSqlServer(connectionString);
            }
        }

        public DbSet<Idea> Ideas { get; set; }
    }
}