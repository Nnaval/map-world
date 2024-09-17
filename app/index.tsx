import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const Home = () => {
  return (
    <SafeAreaView>
      <Text className="text-2xl font-bold ">
        First thing to see, this app must surely be a success
      </Text>
      <Link href="/(root)/(tabs)/home" className="text-blue-500">
        Go Inside the App
      </Link>
    </SafeAreaView>
  );
};

export default Home;
