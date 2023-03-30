import React from 'react';
import { StyleSheet, View, FlatList, Dimensions, Platform } from 'react-native';
import { useInfiniteHits } from 'react-instantsearch-hooks';

const heightParam = Platform.OS == 'ios' ? 'screen' : 'window';

export function InfiniteHits({ hitComponent: Hit, ...props }) {
  const { hits, isLastPage, showMore } = useInfiniteHits(props);

  return (
    <View style={styles.container} >
      <FlatList
        data={hits}
        keyExtractor={(item) => item.objectID}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={() => {
          if (!isLastPage) {
            showMore();
          }
        }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Hit hit={item} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 18,
  },
  container: {
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: Dimensions.get(heightParam).height - 180,
  }
});