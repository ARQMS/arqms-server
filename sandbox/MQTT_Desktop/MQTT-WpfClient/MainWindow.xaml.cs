using System.Windows;

namespace MQTT_WpfClient;

/// <summary>
///     Interaction logic for MainWindow.xaml
/// </summary>
public partial class MainWindow : Window {
    public MainWindow() {
        InitializeComponent();

        Loaded += (sender, args) => {
            if (DataContext is MainViewModel viewModel) viewModel.OnLoaded();
        };
    }
}
