## Geyser React Native Widget

To use this widget in your React Native project, just copy the `components/GeyserCampaign` folder to your components folder, import the component, and render it with the campaign name.

For example for the following project:
https://geyser.fund/project/bitcoinlightningatm

You would use it like this (using the project name from the URL):
```
import GeyserCampaign from './components/GeyserCampaign/GeyserCampaign';

export default function App() {
  return (
    <View>
      <GeyserCampaign campaign={"bitcoinlightningatm"} />
    </View>
  );
}
```

This project does not have any external dependencies, so it should work seamlessly with all React Native projects :)