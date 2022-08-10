// (c) IMT - Information Management Technology AG, CH-9470 Buchs, www.imt.ch.
// SW guideline: Technote Coding Guidelines Ver. 1.6

using System;
using System.Collections.ObjectModel;
using System.Text;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.Input;
using MQTTnet;
using MQTTnet.Client;
using PropertyChanged;

namespace MQTT_WpfClient;

// Note: Notification is implemented with https://github.com/Fody/PropertyChanged
[AddINotifyPropertyChangedInterfaceAttribute]
public class MainViewModel {
    public bool IsLoading { get; set; }
    public ObservableCollection<string> LogHistory { get; set; }
    public IRelayCommand Send { get; }
    public string Topic { get; set; }
    public string Value { get; set; }

    public MainViewModel() {
        m_client = new MqttFactory().CreateMqttClient();

        Topic = "devices/AR-0003/config";
        Value = "";

        Send = new RelayCommand(OnSend);
        LogHistory = new ObservableCollection<string>();
    }

    public async void OnLoaded() {
        var options = new MqttClientOptionsBuilder()
                      .WithClientId(Guid.NewGuid().ToString())
                      .WithTcpServer("localhost", 1883)
                      .WithCleanSession()
                      .Build();

        await ShowLoading(async () => {
            await m_client.ConnectAsync(options);
            Log("Client connected");

            await m_client.SubscribeAsync("devices/+/room/humidity");
            await m_client.SubscribeAsync("devices/+/room/pressure");
            await m_client.SubscribeAsync("devices/+/room/temperature");
            await m_client.SubscribeAsync("devices/+/room/voc");
            await m_client.SubscribeAsync("devices/+/room/co2");

            await Task.Delay(2000);

            m_client.ApplicationMessageReceivedAsync += OnPayloadReceived;
        });
    }

    private Task OnPayloadReceived(MqttApplicationMessageReceivedEventArgs arg) {
        var data  = Encoding.UTF8.GetString(arg.ApplicationMessage.Payload);
        var topic = arg.ApplicationMessage.Topic;

        Log($"received: {topic} - {data}");

        return Task.CompletedTask;
    }

    private async void OnSend() {
        await m_client.PublishStringAsync(Topic, Value);

        Log($"sent: {Topic} - {Value}");
    }

    private void Log(string text) {
        LogHistory.Add(text);
    }

    private async Task ShowLoading(Func<Task> func) {
        IsLoading = true;

        try { await func(); }
        finally { IsLoading = false; }
    }

    private readonly IMqttClient m_client;
}
