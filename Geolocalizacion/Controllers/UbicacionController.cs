using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Geolocalizacion.Models;

namespace Geolocalizacion.Controllers
{
    public class UbicacionController : Controller
    {
        private readonly AppDbContext _context;

        public UbicacionController(AppDbContext context)
        {
            _context = context;
        }

        // GET: Ubicacion
        public async Task<IActionResult> Index()
        {
            return View(await _context.Ubicaciones.ToListAsync());
        }

        [HttpGet]
        public async Task<IActionResult> GetAllJson()
        {
            return Json(await _context.Ubicaciones.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> AddMarker(string nombre, decimal latitud, decimal longitud, int temperatura, int humedad)
        {
            Ubicacion ubicacion = new Ubicacion();

            ubicacion.Nombre = nombre;
            ubicacion.Latitud = latitud;
            ubicacion.Longuitud = longitud;
            ubicacion.Humedad = humedad;
            ubicacion.Estado = true;
            ubicacion.Temperatura = temperatura;
            ubicacion.FechaRegistro = DateTime.Now;

            _context.Add(ubicacion);

            await _context.SaveChangesAsync();

            return Json("Ok");
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRegister(int id, string nombre, decimal latitud, decimal longitud, int temperatura, int humedad, DateTime fechaRegistro)
        {
            Ubicacion ubicacion = new Ubicacion();

            ubicacion.Id = id;
            ubicacion.Nombre = nombre;
            ubicacion.Latitud = latitud;
            ubicacion.Longuitud = longitud;
            ubicacion.Temperatura = temperatura;
            ubicacion.Humedad = humedad;
            ubicacion.FechaRegistro = fechaRegistro;
            ubicacion.FechaActualizacion = DateTime.Now;
            ubicacion.Estado = true;

            _context.Update(ubicacion);
            await _context.SaveChangesAsync();

            return Json("Ok");
        }

        [HttpPut]
        public async Task<IActionResult> DisableRegister(int id, string nombre, decimal latitud, decimal longitud, int temperatura, int humedad, DateTime fechaRegistro)
        {
            Ubicacion ubicacion = new Ubicacion();

            ubicacion.Id = id;
            ubicacion.Nombre = nombre;
            ubicacion.Latitud = latitud;
            ubicacion.Longuitud = longitud;
            ubicacion.Temperatura = temperatura;
            ubicacion.Humedad = humedad;
            ubicacion.FechaRegistro = fechaRegistro;
            ubicacion.FechaActualizacion = DateTime.Now;
            ubicacion.Estado = false;

            _context.Update(ubicacion);
            await _context.SaveChangesAsync();

            return Json("Ok");
        }

        // GET: Ubicacion/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ubicacion = await _context.Ubicaciones
                .FirstOrDefaultAsync(m => m.Id == id);
            if (ubicacion == null)
            {
                return NotFound();
            }

            return View(ubicacion);
        }

        // GET: Ubicacion/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Ubicacion/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Nombre,Latitud,Longuitud,Temperatura,Humedad")] Ubicacion ubicacion)
        {
            if (ModelState.IsValid)
            {
                ubicacion.Estado = true;
                ubicacion.FechaRegistro = DateTime.Now;
                _context.Add(ubicacion);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Create));
            }
            return View(ubicacion);
        }

        //[HttpPost]
        //public int AddMarker()
        //{

        //}

        // GET: Ubicacion/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ubicacion = await _context.Ubicaciones.FindAsync(id);
            if (ubicacion == null)
            {
                return NotFound();
            }
            return View(ubicacion);
        }

        // POST: Ubicacion/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Nombre,Latitud,Longuitud,Temperatura,Humedad")] Ubicacion ubicacion)
        {
            if (id != ubicacion.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(ubicacion);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UbicacionExists(ubicacion.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(ubicacion);
        }

        // GET: Ubicacion/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ubicacion = await _context.Ubicaciones
                .FirstOrDefaultAsync(m => m.Id == id);
            if (ubicacion == null)
            {
                return NotFound();
            }

            return View(ubicacion);
        }

        // POST: Ubicacion/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var ubicacion = await _context.Ubicaciones.FindAsync(id);
            _context.Ubicaciones.Remove(ubicacion);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool UbicacionExists(int id)
        {
            return _context.Ubicaciones.Any(e => e.Id == id);
        }
    }
}
