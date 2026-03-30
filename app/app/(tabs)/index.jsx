import { Text, View } from 'react-native';
import SafeView from '../../components/layout/safeView';

const Home = () => {
  return (
    <SafeView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>If you see this, Home is working!</Text>
      </View>
    </SafeView>
  );
}

export default Home;
