using DatingAPI.Data;
using DatingAPI.Dtos;
using DatingAPI.Helpers;
using DatingAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Repo
{
    public class DatingApiRepository : IDatingApiRepo
    {
        private readonly DataContext _context;
        public DatingApiRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> getLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> getMainPhoto(int id)
        {
            return await _context.Photos.Where(u => u.UserId == id).FirstOrDefaultAsync(p => p.isMain== true);
        }

        public async Task<Photo> getPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.User.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<PageList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.User.Include(p => p.Photos).OrderByDescending(u=>u.LastActive).AsQueryable();
            users = users.Where(x => x.Id != userParams.UserId);
            users = users.Where(x => x.Gender.ToLower() == userParams.Gender);
            if (userParams.Likers)
            {
                var userLikers = await getUserLikes(userParams.UserId,userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            if (userParams.Likees)
            {
                var userLikees = await getUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }
            if (userParams.MinAge!=18 || userParams.MaxAge != 98)
            {
                var minDob = DateTime.Today.AddYears(userParams.MaxAge-1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch(userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.CreatedAt);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PageList<User>.CreateAsync(users,userParams.PageNumber,userParams.PageSize) ;
        }
        private async Task<IEnumerable<int>>getUserLikes(int id,Boolean likers)
        {
            var user = await _context.User.Include(u => u.Likers).Include(u => u.Likees).FirstOrDefaultAsync(u=>u.Id==id);
            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else
            {
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> getMessages(int id)
        {
            return await _context.Message.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PageList<Message>> getMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Message.Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u=>u.Recipient).ThenInclude(p=>p.Photos).AsQueryable();
            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted==false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId && u.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.IsRead==false && u.RecipientDeleted == false);
                    break;
            }
            messages = messages.OrderByDescending(d => d.MessageSent);
            return await PageList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> getMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Message
              .Include(u => u.Sender).ThenInclude(p => p.Photos)
              .Include(u => u.Recipient).ThenInclude(p => p.Photos)
              .Where(m => m.RecipientId == userId && m.RecipientDeleted == false
                  && m.SenderId == recipientId
                  || m.RecipientId == recipientId && m.SenderId == userId
                  && m.SenderDeleted == false)
              .OrderByDescending(m => m.MessageSent)
              .ToListAsync();

            return messages;



        }


    }
}
