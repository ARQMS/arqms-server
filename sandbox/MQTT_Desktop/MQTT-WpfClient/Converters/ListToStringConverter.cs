// (c) IMT - Information Management Technology AG, CH-9470 Buchs, www.imt.ch.
// SW guideline: Technote Coding Guidelines Ver. 1.6

using System;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Windows.Data;

namespace MQTT_WpfClient.Converters;

[ValueConversion(typeof(ObservableCollection<string>), typeof(string))]
public class ListToStringConverter : IMultiValueConverter {
    public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture) {
        if (targetType != typeof(string)) throw new InvalidOperationException("The target must be a String");

        var size = (int)values[1];
        if (values[0] is ObservableCollection<string> list) {
            return string.Join("\n", list.Take(size).ToArray());
        }

        return string.Empty;
    }

    public object[] ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture) {
        throw new NotImplementedException();
    }
}
