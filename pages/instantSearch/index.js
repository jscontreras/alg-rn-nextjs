import React, { useRef } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch-hooks';
import { SearchBox } from "../../components/SearchBox";
import { InfiniteHits } from "../../components/InfiniteHits";
import { Hit } from "../../components/Hit";
import { FiltersView } from '../../views/FiltersView';

const searchClient = algoliasearch('SGF0RZXAXL', '0ac0c3b165eb3773097eca1ac25d8fdd');

export default function App() {
  const listRef = useRef(null);
  function scrollToTop() {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.mainContainer}>
        <InstantSearch searchClient={searchClient} indexName="dev_multifacets_demo">
          <Configure ruleContexts={['my-static-value']} />
          <SearchBox onChange={scrollToTop} />
          <InfiniteHits hitComponent={Hit} />
          <FiltersView />
        </InstantSearch>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerOverlay: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 10,
    width: '100%',
    flexBasis: 200,
    backgroundColor: '#252b33',
    paddingTop: 10,
    paddingBottom: 10,
    height: 150,
    zIndex: 99,
  },
  triggerButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 99,
  },
  triggerButtonText: {
    color: 'white',
    fontSize: 18,
  },
  safe: {
    flex: 10,
    backgroundColor: '#252b33',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
});
