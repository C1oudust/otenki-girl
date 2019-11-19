using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using otenki_girl.Model;

namespace otenki_girl.Service
{
    public class MessageService
    {
        private readonly Db _db;

        public MessageService(Db db)
        {
            this._db = db;
        }

        public bool AddMessage(AddMessage massage)
        {
            var m = new Message
            {
                Address = massage.Address,
                AddTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm"),
                Date = massage.Date,
                Name = massage.Name,
                Reason = massage.Reason
            };
            _db.Message.Add(m);
            int i = _db.SaveChanges();
            if (i>0)
            {
                return true;
            }

            return false;
        }

        public bool DeleteMessage(int id)
        {
            var m = _db.Message.FirstOrDefault(c => c.Id == id);
            if (m ==null)
            {
                return false;
            }

            _db.Message.Remove(m);

            int i = _db.SaveChanges();
            if (i > 0)
            {
                return true;
            }

            return false;
        }


        public List<Message> GetMessageList()
        {
            List<Message> m = new List<Message>();

            var list = _db.Message
                .OrderByDescending(c => c.AddTime)
                .ToList();
            foreach (var massage in list)
            {
                m.Add(massage);
            }
            return m;
        }

        public List<Message> GetMessageList(int pageIndex, int pageSize)
        {
            List<Message> m = new List<Message>();

            var list = _db.Message
                .OrderBy(c => c.AddTime)
                .ToList();
            foreach (var massage in list)
            {
                m.Add(massage);
            }
            return m;
        }
        public int GetMessageCount(Expression<Func<Message, bool>> where)
        {
            var count = _db.Message.Where(where).Count();
            return count;
        }
    }
}
