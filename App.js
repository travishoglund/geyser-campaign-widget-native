import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GeyserCampaign from './components/GeyserCampaign/GeyserCampaign';

export default function App() {
  return (
    <View style={styles.container}>
      <GeyserCampaign campaign={"nostrhackweek"} api={"https://api.staging.geyser.fund"} />
      <GeyserCampaign campaign={"bitcoinpark"} api={"https://api.staging.geyser.fund"} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
