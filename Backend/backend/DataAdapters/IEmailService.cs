using System.Threading.Tasks;

namespace backend.DataAdapters
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }
}