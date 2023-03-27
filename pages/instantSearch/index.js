import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch-hooks';
import { SearchBox } from "../../components/SearchBox";
import { InfiniteHits } from "../../components/InfiniteHits";
import { Hit } from "../../components/Hit";
import { FiltersView } from "../../views/FiltersView";

const searchClient = algoliasearch('SGF0RZXAXL', '0ac0c3b165eb3773097eca1ac25d8fdd');

const Overlay = forwardRef(({ onClose }, ref) => {
  const [height, setHeight] = useState(0);
  const [opacity, setOpacity] = useState(0);

  const expandOverlay = () => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i >= 5) {
        clearInterval(intervalId);
        return;
      }
      setHeight(i * 25);
      setOpacity(i * .25);
      i++;
    }, 50);
  };

  const collapseOverlay = () => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i >= 5) {
        onClose();
        clearInterval(intervalId);
        return;
      }
      setHeight(100 - i * 25);
      setOpacity(1 -i * .25);

      i++;
    }, 50);
  };

  useImperativeHandle(ref, () => ({
    expandOverlay,
  }));

  // { height: height.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }

  return (
    <View style={[styles.overlay, { height: `${height}%`, opacity }]}>
      <TouchableOpacity style={styles.closeButton} onPress={collapseOverlay} >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      <View style={styles.overlayContent}>
        <FiltersView />
      </View>
    </View>
  );
});

let showOverlayVar = false;

export default function App() {
  const listRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef(null);

  const triggerOverlay = () => {
    setShowOverlay(true);
    showOverlayVar = true;
    console.log('overlayRef.current', overlayRef.current)
    overlayRef.current.expandOverlay();
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  function scrollToTop() {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.mainContainer}>
        <InstantSearch searchClient={searchClient} indexName="instant_search">
          <Configure ruleContexts={['my-static-value']} />
          <SearchBox onChange={scrollToTop} />
          <InfiniteHits hitComponent={Hit} />
          <Overlay ref={overlayRef} onClose={closeOverlay} />
          <View style={styles.containerOverlay}>
            <TouchableOpacity style={styles.triggerButton} onPress={triggerOverlay}>
              <Text style={styles.triggerButtonText}>Set Filters</Text>
            </TouchableOpacity>
          </View>
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
  overlay: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    display: 'flex',
    width: '100%',
    opacity: 0,
    zIndex: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex:9,
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 18,
  },
  overlayContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 24,
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
