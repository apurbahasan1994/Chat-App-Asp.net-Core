using DatingAPI.Data;
using DatingAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Repo
{
    public class AuthRepo : IAuthRepo
    {
        private readonly DataContext _context;

        public AuthRepo(DataContext context)
        {
            this._context = context;
        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.User.Include(p=>p.Photos).FirstOrDefaultAsync(x => x.UserName == username);
            if (user == null)
            {
                return null;
            }
            if (!verifyPasswordHash(password, user.PassWordHash, user.PassWordSalt))
            {
                return null;
            }
            return user;
        }

        private bool verifyPasswordHash(string password, byte[] passwordHash,byte[] PassWordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(PassWordSalt))
            {
                
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
                return true;
            }
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordhash, passwordSalt;
            CreatePassHash(password, out passwordhash, out passwordSalt);
            user.PassWordHash = passwordhash;
            user.PassWordSalt = passwordSalt;
            await _context.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        private void CreatePassHash(string password, out byte[] passwordhash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordhash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
           
        }

        public async Task<bool> UserExist(string username)
        {
            if(await _context.User.AnyAsync(x => x.UserName == username))
            {
                return true;
            }
            return false;
        }
    }
}
