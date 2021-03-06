using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Dtos
{
    public class PhotoForCreationDto
    { 
    
        public IFormFile File { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool isMain { get; set; }
        public string PublicId { get; set; }
        public PhotoForCreationDto()
        {
            DateAdded = DateTime.Now;
        }
    }
}
