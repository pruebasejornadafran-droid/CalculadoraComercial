namespace ShinePresupuestos;

public sealed class AppConfig
{
    public string Name { get; set; } = "Shine Presupuestos";

    public string Url { get; set; } =
        "https://script.google.com/a/macros/shine.co/s/AKfycbyxNLtpz221TEkaMyBJyzcdgNxrFFp0pXpQFiH8PD6G90bxTnq01ol7SCKM1d4djGT-IA/exec";

    public int Width { get; set; } = 1440;
    public int Height { get; set; } = 900;

    public int MinWidth { get; set; } = 1100;
    public int MinHeight { get; set; } = 700;
}