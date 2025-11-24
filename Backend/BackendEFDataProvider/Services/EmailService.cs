using backend.DataAdapters;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace BackendEFDataProvider.Services
{
    public class EmailService : IEmailService
    {
        private readonly string smtpServer = "smtp.gmail.com";
        private readonly int smtpPort = 587;
        private readonly string smtpUser = "adnaneeljabri099@gmail.com";
        private readonly string smtpPass = "bzosjlzppuaaoqmr"; 

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var client = new SmtpClient(smtpServer)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true,
            };

            var mail = new MailMessage
            {
                From = new MailAddress(smtpUser),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);

            await client.SendMailAsync(mail);
        }
    }
}