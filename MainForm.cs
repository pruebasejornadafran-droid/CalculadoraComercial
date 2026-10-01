using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
using System.Diagnostics;
using System.Text.Json;

namespace ShinePresupuestos;

public sealed class MainForm : Form
{
    private readonly WebView2 webView = new();
    private AppConfig config = new();

    public MainForm()
    {
        LoadConfiguration();

        Text = config.Name;

        Width = config.Width;
        Height = config.Height;

        MinimumSize = new Size(
            config.MinWidth,
            config.MinHeight
        );

        StartPosition = FormStartPosition.CenterScreen;

        webView.Dock = DockStyle.Fill;

        Controls.Add(webView);

        Shown += async (_, _) =>
        {
            await StartWebView();
        };
    }

    private void LoadConfiguration()
    {
        try
        {
            string path = Path.Combine(
                AppContext.BaseDirectory,
                "config.json"
            );

            if (!File.Exists(path))
                return;

            string json = File.ReadAllText(path);

            config =
                JsonSerializer.Deserialize<AppConfig>(
                    json,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }
                )
                ?? new AppConfig();
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                "No se ha podido leer config.json.\n\n" +
                ex.Message,
                "Shine Presupuestos",
                MessageBoxButtons.OK,
                MessageBoxIcon.Warning
            );
        }
    }

    private async Task StartWebView()
    {
        try
        {
            string userDataFolder = Path.Combine(
                Environment.GetFolderPath(
                    Environment.SpecialFolder.LocalApplicationData
                ),
                "Shine",
                "Shine Presupuestos",
                "WebView2"
            );

            CoreWebView2Environment environment =
                await CoreWebView2Environment.CreateAsync(
                    null,
                    userDataFolder
                );

            await webView.EnsureCoreWebView2Async(
                environment
            );

            webView.CoreWebView2.Settings.AreDevToolsEnabled = false;
            webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = true;
            webView.CoreWebView2.Settings.IsStatusBarEnabled = false;

            webView.CoreWebView2.NewWindowRequested +=
                WebView_NewWindowRequested;

            webView.CoreWebView2.NavigationStarting +=
                WebView_NavigationStarting;

            webView.Source = new Uri(config.Url);
        }
        catch (WebView2RuntimeNotFoundException)
        {
            MessageBox.Show(
                "Microsoft Edge WebView2 Runtime no está instalado.\n\n" +
                "Instálalo y vuelve a abrir Shine Presupuestos.",
                "Shine Presupuestos",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error
            );

            Close();
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                "No se ha podido iniciar Shine Presupuestos.\n\n" +
                ex.Message,
                "Shine Presupuestos",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error
            );
        }
    }

    private void WebView_NewWindowRequested(
        object? sender,
        CoreWebView2NewWindowRequestedEventArgs e)
    {
        if (string.IsNullOrWhiteSpace(e.Uri))
            return;

        try
        {
            Process.Start(
                new ProcessStartInfo
                {
                    FileName = e.Uri,
                    UseShellExecute = true
                }
            );

            e.Handled = true;
        }
        catch
        {
            e.Handled = false;
        }
    }

    private void WebView_NavigationStarting(
        object? sender,
        CoreWebView2NavigationStartingEventArgs e)
    {
        if (string.IsNullOrWhiteSpace(e.Uri))
            return;

        Uri target;

        try
        {
            target = new Uri(e.Uri);
        }
        catch
        {
            return;
        }

        Uri appUri = new(config.Url);

        bool allowed =
            target.Host.EndsWith("script.google.com", StringComparison.OrdinalIgnoreCase) ||
            target.Host.EndsWith("googleusercontent.com", StringComparison.OrdinalIgnoreCase) ||
            target.Host.EndsWith("accounts.google.com", StringComparison.OrdinalIgnoreCase);

        if (allowed)
            return;

        if (target.Host.Equals(appUri.Host, StringComparison.OrdinalIgnoreCase))
            return;

        try
        {
            Process.Start(
                new ProcessStartInfo
                {
                    FileName = e.Uri,
                    UseShellExecute = true
                }
            );

            e.Cancel = true;
        }
        catch
        {
        }
    }
}