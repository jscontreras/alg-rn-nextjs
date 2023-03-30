import { useState, useRef } from 'react';
import { useDynamicWidgets, useInstantSearch } from 'react-instantsearch-hooks';
import { Dimensions, StyleSheet, ScrollView, TouchableOpacity, View, Text, Animated, Platform } from "react-native";
import { MyDynamicWidgets } from '../components/MyDinamicWidgets';

const heightParam = Platform.OS == 'ios' ? 'screen' : 'window';
const windowHeight = Dimensions.get(heightParam).height;

export const FiltersView = () => {
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const [transformY, setTransformY] = useState(0);
  const [recordedState, setRecordedState] = useState(null);
  const [formState, setFormState] = useState('OPEN');
  const positionAnim = useRef(new Animated.Value(0)).current;
  let start = null;

  function animateOpeningWeb(currentTime) {
    if (start == null) {
      start = currentTime;
    }
    const elapsed = currentTime - start; // Calculate the elapsed time since the animation started
    const progress = Math.min(elapsed / 300, 1); // Calculate the progress of the animation as a value between 0 and 1
    const value = - windowHeight * progress; // Calculate the current value of the animation
    setTransformY(value);
    if (progress < 1) {
      // If the animation isn't finished yet, request another frame
      requestAnimationFrame(animateOpeningWeb);
    }
  }

  function animateClosingWeb(currentTime) {
    if (start == null) {
      start = currentTime;
    }
    const elapsed = currentTime - start; // Calculate the elapsed time since the animation started
    const progress = Math.min(elapsed / 300, 1); // Calculate the progress of the animation as a value between 0 and 1
    const value = - windowHeight * (1 - progress); // Calculate the current value of the animation
    setTransformY(value);
    if (progress < 1) {
      // If the animation isn't finished yet, request another frame
      requestAnimationFrame(animateClosingWeb);
    }
  }


  const animateOpening = () => {
    if (Platform.OS === 'web') {
      start = null;
      requestAnimationFrame(animateOpeningWeb);
    } else {
      // Animation duration and target value
      Animated.timing(positionAnim, {
        toValue: -1 * windowHeight,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }

  };

  const animateClose = () => {
    if (Platform.OS === 'web') {
      start = null;
      requestAnimationFrame(animateClosingWeb);
    } else {
      // Animation duration and target value
      Animated.timing(positionAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };


  function onCancel() {
    collapseOverlay();
    setFormState('OPEN');
    setTimeout(() => {
      if (recordedState) {
        setIndexUiState(recordedState);
      }
    }, 400);
  }

  const toggleOverlay = () => {
    setRecordedState(indexUiState);
    if (formState == 'OPEN') {
      setFormState('CLOSE');
      animateOpening();
    } else {
      setFormState('OPEN');
      animateClose();
    }
  };

  const collapseOverlay = () => {
    setFormState('OPEN');
    animateClose();
  };

  // Get all the Available refinements and render them.
  const { attributesToRender } = useDynamicWidgets({ facets: ['*'] });

  return (
    <>
      <Animated.View style={[styles.filtersOverlay, {
        transform: [{ translateY: Platform.OS == 'web' ? transformY : positionAnim },],
      }]}>
        <View style={styles.topLinks}>
          <TouchableOpacity style={styles.closeButton} onPress={collapseOverlay} >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.overlayContent}>
          <ScrollView style={styles.filtersContainer}>
            <MyDynamicWidgets facets={attributesToRender} />
          </ScrollView>
        </View>
      </Animated.View>
      {/* Buttons Panel */}
      <View style={styles.buttonsOverlay}>
        {formState == 'CLOSE' && (
          <>
            <TouchableOpacity style={[styles.triggerButton, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.triggerButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.triggerButton} onPress={toggleOverlay}>
              <Text style={styles.triggerButtonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
        {formState == 'OPEN' && (
          <>
            <TouchableOpacity style={styles.triggerButton} onPress={toggleOverlay}>
              <Text style={styles.triggerButtonText}>Set Filters</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexBasis: windowHeight - 150,
    width: Dimensions.get(heightParam).width,
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingTop: 0,
    flexGrow: 0,
  },
  filtersOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: windowHeight,
    height: windowHeight - (Platform.OS === 'ios' ? 150 : 80),
    backgroundColor: '#eee',
    display: 'flex',
    width: '100%',
    opacity: 1,
    zIndex: 0,
  },
  facetsContainer: {
    paddingBottom: 80,
  },
  topLinks: {
    display: 'flex',
    width: Dimensions.get(heightParam).width,
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    flexDirection: 'row',
  },
  closeButton: {
    padding: 20,
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
  buttonsOverlay: {
    position: 'absolute',
    top: Dimensions.get(heightParam).height - (Platform.OS === 'ios' ? 150 : 80),
    flex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    width: '100%',
    flexBasis: 100,
    backgroundColor: '#252b33',
    paddingTop: 30,
    paddingBottom: 200,
    height: 100,
    zIndex: 10,
  },
  triggerButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 99,
    height: 40,
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: 'red',
    marginRight: 20,
  },
  triggerButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
