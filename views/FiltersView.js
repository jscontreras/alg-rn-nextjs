import { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { useDynamicWidgets, useInstantSearch } from 'react-instantsearch-hooks';
import { Dimensions, StyleSheet, ScrollView, TouchableOpacity, View, Text } from "react-native";
import { CategoriesMenu } from "../components/CategoriesMenu";
import { RefinementList } from '../components/RefinementList';


export const FiltersView = () => {
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const [height, setHeight] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [recordedState, setRecordedState] = useState(null);
  const [buttonText, setButtonText] = useState('Set Filters');
  const [formState, setFormState] = useState('OPEN');


  function onCancel() {
    setButtonText('Set Filters')
    console.log('reseting state, comming soon');
    collapseOverlay();

    if (recordedState) {
      setIndexUiState(recordedState);
    }
  }

  const triggerOverlay = () => {
    setRecordedState(indexUiState);
    if (formState == 'OPEN') {
      setButtonText('Submit');
      setFormState('CLOSE');
      console.log('setting state, comming soon');
      expandOverlay();
    } else {
      setButtonText('Set Filters');
      collapseOverlay();
    }
  };

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
    setFormState('OPEN');
    let i = 0;
    const intervalId = setInterval(() => {
      if (i >= 5) {
        clearInterval(intervalId);
        return;
      }
      setHeight(100 - i * 25);
      setOpacity(1 - i * .25);

      i++;
    }, 50);
    setButtonText('Set Filters')
  };


  // Get all the Available refinements and render them.
  const { attributesToRender } = useDynamicWidgets({ facets: ['*'] });

  return (
    <>
      <View style={[styles.overlay, { height: `${height}%`, opacity }]}>
        <TouchableOpacity style={styles.closeButton} onPress={collapseOverlay} >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <View style={styles.overlayContent}>
          <ScrollView style={styles.filtersContainer}>
            <MyDynamicWidgets facets={attributesToRender} />
          </ScrollView>
        </View>
      </View>
      <View style={styles.containerOverlay}>
        {formState == 'CLOSE' && (
          <TouchableOpacity style={[styles.triggerButton, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.triggerButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.triggerButton} onPress={triggerOverlay}>
          <Text style={styles.triggerButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const MyDynamicWidgets = ({ facets }) => {
  let hierarchicalAdded = false;
  /*
  {
    attributes: [
      'skuProperties.hierarchicalCategories.lvl0',
      'skuProperties.hierarchicalCategories.lvl1',
      'skuProperties.hierarchicalCategories.lvl2',
    ],
    rootPath: null,
    type: CategoriesMenu,
    title: 'Categories',
    key: `hcat-0`
  }*/
  const organizedFacets = [];
  facets.forEach((facetName, index) => {
    if (facetName.startsWith('skuProperties.hierarchicalCategories')) {
      if (!hierarchicalAdded) {
        hierarchicalAdded = true;
        organizedFacets.push({
          attributes: [
            'skuProperties.hierarchicalCategories.lvl0',
            'skuProperties.hierarchicalCategories.lvl1',
            'skuProperties.hierarchicalCategories.lvl2'
          ],
          type: CategoriesMenu,
          title: 'Categories',
          key: `${facetName}-${index}`,
          rootPath: null,
        });
      }
    }
    // add more cases
    else if (!facetName.startsWith('skuProperties.hierarchicalCategories')) {
      organizedFacets.push({
        attribute: facetName, type: RefinementList, title: facetName.split('.').pop(), key: `${facetName}-${index}`
      });
    }

  });
  return <>
    {organizedFacets.map(facet => {
      const DynamicComponent = facet.type;
      const facetProps = { ...facet };
      delete facetProps.type;
      return <DynamicComponent {...facetProps} />
    })}
  </>
}

const styles = StyleSheet.create({
  filtersContainer: {
    flexBasis: Dimensions.get('window').height - 120,
    width: '100vw',
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 0,
    flexGrow: 0,
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
    zIndex: 9,
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
  containerOverlay: {
    flex: 10,
    flexDirection:'row',
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
  cancelButton: {
    backgroundColor: 'red',
    marginRight: 20,
  },
  triggerButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
