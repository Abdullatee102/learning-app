import { Text, View } from 'react-native';

const Message = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>If you see this, Message is working!</Text>
    </View>
  );
}

export default Message;