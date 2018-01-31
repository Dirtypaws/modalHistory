namespace Bootstrap4.Models
{
    public class ModalModel
    {
        public string Title { get; set; }
        public bool EnableSave { get; set; }
        public bool DisableClose { get; set; }

        public string SaveText { get; set; } = "Save changes";
        public string CloseText { get; set; } = "Cancel";
    }
}