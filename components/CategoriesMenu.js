import React, { useEffect, useRef } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useHierarchicalMenu, useInstantSearch } from 'react-instantsearch-hooks-web';

function renderItem(item, path, key, canRefine, refine, level = 2) {
  const refineAction = (value) => {
    if (canRefine) {
      refine(value);
    }
  };

  if (!item.data) {
    return (
      <TouchableOpacity
        key={key}
        onPress={() => refineAction(item.value)}
        style={styles.item}
      >
        <Text style={item.isRefined ? styles.textRefined : styles.text}>
          {item.label} ({item.count})
        </Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <View key={key} style={styles.container}>
        <TouchableOpacity
          onPress={() => refineAction(item.value)}
          style={styles.item}
        >
          <Text style={item.isRefined ? styles.textRefined : styles.text}>
            {item.label} ({item.count})
          </Text>
        </TouchableOpacity>
        <View style={{ marginLeft: 10 * level }}>
          {item.data.map((child, keyChild) => (
            renderItem(
              child,
              `${path}/${item.label}`,
              `${key}_${keyChild}`,
              canRefine,
              refine,
              level + 2
            )
          ))}
        </View>
      </View>
    );
  }
}

export function CategoriesMenu(props) {
  const {
    items,
    isShowingMore,
    canToggleShowMore,
    canRefine,
    refine,
    sendEvent,
    toggleShowMore,
    createURL,
  } = useHierarchicalMenu(props);

  const { uiState, setUiState } = useInstantSearch();
  const uiStateRef = useRef(uiState);
  const rootPathUrl = props.rootPath
    ? '/' + props.rootPath.replace(/\s>\s/g, '/')
    : '';

  // Keep up to date uiState in a reference
  useEffect(() => {
    uiStateRef.current = uiState;
    console.log('Mount');
    return ()=> {
      console.log('Demount')
    }
  }, [uiState]);

  return (
    <View>
      {items.map((item, key) =>
        renderItem(item, `/category_pages${rootPathUrl}`, key, canRefine, refine)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  item: {
    padding: 15,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  text: {
    color: 'red',
    fontSize: 15
  },
  textRefined: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 15
  },
});
