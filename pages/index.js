import React, {useRef} from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, Text } from 'react-native';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-hooks';
import { SearchBox } from "../components/SearchBox";
import { InfiniteHits } from "../components/InfiniteHits";

const searchClient = algoliasearch('SGF0RZXAXL', '0ac0c3b165eb3773097eca1ac25d8fdd');

export default function App() {
  const listRef = useRef(null);

  function scrollToTop() {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <InstantSearch searchClient={searchClient} indexName="instant_search">
          <SearchBox onChange={scrollToTop} />
          <InfiniteHits hitComponent={Hit} />
        </InstantSearch>
      </View>
    </SafeAreaView>
  );
}

function Hit({ hit }) {
  return (
    <Text>{hit.name}</Text>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#252b33',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
});
