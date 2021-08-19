using DatingAPI.Helpers;
using DatingAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Repo
{
    public interface IDatingApiRepo
    {

        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<PageList<User>> GetUsers(UserParams userParams);
        Task<User> GetUser(int id);
        Task<Photo> getPhoto(int id);
        Task<Photo> getMainPhoto(int id);
        Task<Like> getLike(int userId, int recipientId);
        Task<Message> getMessages(int id);
        Task<PageList<Message>> getMessagesForUser(MessageParams message);
        Task<IEnumerable<Message>> getMessageThread(int userId, int recipientId);


    }
}
