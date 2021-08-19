using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Helpers
{
    public class PageList<T>:List<T>
    {
        public int CurrentPage { get; set; }
        public int TotalPage { get; set; }
        public int PageSize { set; get; }
        public int TotalCount { get; set; }
        public PageList(List<T> items, int count, int PageNumber, int PageSize)
        {
            this.TotalCount = count;
            this.PageSize = PageSize;
            this.CurrentPage = PageNumber;
            this.TotalPage = (int)Math.Ceiling(count / (double)PageSize);
            this.AddRange(items);

        }
        public static async Task<PageList<T>> CreateAsync(IQueryable<T> source, int PageNumber, int PageSize){
            var count = await source.CountAsync();
            var items = await source.Skip((PageNumber - 1) * PageSize).Take(PageSize).ToListAsync();
            return new PageList<T>(items, count, PageNumber, PageSize);
        }

    }
}
