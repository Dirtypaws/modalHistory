using System.Web.Mvc;
using Bootstrap4.Models;

namespace Bootstrap4.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Modal(int id)
        {
            var model = new ModalPageModel
            {
                Title = $"Page: {id}",
                PageNumber = id
            };

            return View("PageModal", "_Modal", model);
        }
    }
}