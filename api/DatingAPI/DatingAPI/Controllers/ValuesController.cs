using DatingAPI.Data;
using DatingAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _context;

        public ValuesController(DataContext context)
        {
            this._context = context;
        }

        [HttpGet("getValues")]
        public async Task<IActionResult> getValues()
        {
            var values = await _context.Values.ToListAsync();
            return Ok(values);
        }
        [HttpGet("getValue/{id}")]
        public async Task<IActionResult> getValue(int id)
        {
            var value =await _context.Values.FirstOrDefaultAsync(x => x.Id == id);
            return Ok(value);
        }
        [HttpPost("saveValue")]
        public async Task<IActionResult> saveValues( [FromBody] Value value)
        {
            await _context.AddAsync(value);
            _context.SaveChanges();
            return Ok();
        }
    }
}
