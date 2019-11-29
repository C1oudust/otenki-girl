using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using otenki_girl.Model;

namespace otenki_girl.Service
{
    public class Db:DbContext
    {
        public Db() {}
        public DbSet<Message> Message { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlite("Data Source=../otenki_girl.Service/message.db");
        }
    }

}
