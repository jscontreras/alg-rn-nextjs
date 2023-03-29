import { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react';
import { useDynamicWidgets, useInstantSearch } from 'react-instantsearch-hooks';
import { Dimensions, StyleSheet, ScrollView, TouchableOpacity, View, Text } from "react-native";
import { CategoriesMenu } from "../components/CategoriesMenu";
import { RefinementList } from '../components/RefinementList';


export const FiltersView = () => {
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const [height, setHeight] = useState(Dimensions.get('window').height);
  const [opacity, setOpacity] = useState(0);
  const [recordedState, setRecordedState] = useState(null);
  const [buttonText, setButtonText] = useState('Set Filters');
  const [formState, setFormState] = useState('OPEN');
  let i = 1;

  function onCancel() {
    setButtonText('Set Filters')
    collapseOverlay();
    setTimeout(() => {
      if (recordedState) {
        setIndexUiState(recordedState);
      }
    }, 400);
  }

  const triggerOverlay = () => {
    setRecordedState(indexUiState);
    if (formState == 'OPEN') {
      setButtonText('Submit');
      setFormState('CLOSE');
      expandOverlay();
    } else {
      setButtonText('Set Filters');
      collapseOverlay();
    }
  };

  const expandOverlay = () => {
    const screenHeight = Dimensions.get('window').height;
    const intervalId = setInterval(() => {
      if (i >= 5) {
        clearInterval(intervalId);
        return;
      }
      const factor = i * .25 * screenHeight;
      setHeight(screenHeight - factor);
      setOpacity(i * .25);
      i++;
    }, 50);
  };

  const collapseOverlay = () => {
    setFormState('OPEN');
    const screenHeight = Dimensions.get('window').height;
    let i = 0;
    const intervalId = setInterval(() => {
      if (i >= 5) {
        clearInterval(intervalId);
        return;
      }
      setHeight((i * .25) * screenHeight);
      setOpacity(1 - i * .25);

      i++;
    }, 50);
    setButtonText('Set Filters')
  };


  // Get all the Available refinements and render them.
  const { attributesToRender } = useDynamicWidgets({ facets: ['*'] });

  return (
    <>
      {/* <View style={[styles.overlay, { height: `${height}%%`, opacity }]}> */}
      <View style={[styles.filtersOverlay, { top: height }]}>
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
      </View>
      <View style={styles.buttonsOverlay}>
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
  const organizedFacets = [
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
    }
  ];
  // facets.forEach((facetName, index) => {
  //   if (facetName.startsWith('skuProperties.hierarchicalCategories')) {
  //     if (!hierarchicalAdded) {
  //       hierarchicalAdded = true;
  //       organizedFacets.push({
  //         attributes: [
  //           'skuProperties.hierarchicalCategories.lvl0',
  //           'skuProperties.hierarchicalCategories.lvl1',
  //           'skuProperties.hierarchicalCategories.lvl2'
  //         ],
  //         type: CategoriesMenu,
  //         title: 'Categories',
  //         key: `${facetName}-${index}`,
  //         rootPath: null,
  //       });
  //     }
  //   }
  //   // add more cases
  //   else if (!facetName.startsWith('skuProperties.hierarchicalCategories')) {
  //     organizedFacets.push({
  //       attribute: facetName, type: RefinementList, title: facetName.split('.').pop(), key: `${facetName}-${index}`
  //     });
  //   }

  // });
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
    width: Dimensions.get('window').width,
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 0,
    flexGrow: 0,
  },
  filtersOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: Dimensions.get('window').height - 100,
    backgroundColor: 'lightblue',
    display: 'flex',
    width: '100%',
    opacity: 1,
    zIndex: 0,
  },
  topLinks: {
    display: 'flex',
    width: Dimensions.get('window').width,
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
    position: 'fixed',
    bottom: 0,
    flex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 10,
    width: '100%',
    flexBasis: 100,
    backgroundColor: '#252b33',
    paddingTop: 10,
    paddingBottom: 10,
    height: 100,
    zIndex: 10,
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
