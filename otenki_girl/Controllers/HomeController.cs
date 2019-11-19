using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using otenki_girl.Model;
using otenki_girl.Service;

namespace otenki_girl.Controllers
{
    public class HomeController : Controller
    {
        private readonly MessageService _messageService;

        public HomeController(MessageService messageService)
        {
            _messageService = messageService;
        }

        public IActionResult Index()
        {
            
//            _massageService.AddMassage()
            ViewData["MessagesList"] = _messageService.GetMessageList();
            return View();
        }


        [HttpPost]
        public  JsonResult AddMessage(AddMessage message)
        {
            return Json(_messageService.AddMessage(message));
        }

        [HttpGet]
        public JsonResult GetMessage(int pageIndex, int pageSize)
        {
            int count = _messageService.GetMessageCount(c=> true);
            var m = _messageService.GetMessageList(pageSize, pageIndex);
            return Json( new {count,m});
        }

    }
}
