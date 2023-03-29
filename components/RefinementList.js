import { useRefinementList } from 'react-instantsearch-hooks-web';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native-web';


export function RefinementList(props) {
  const { title } = props;
  const {
    items,
    hasExhaustiveItems,
    createURL,
    refine,
    sendEvent,
    searchForItems,
    isFromSearch,
    canRefine,
    canToggleShowMore,
    isShowingMore,
    toggleShowMore,
  } = useRefinementList(props);

  if (items.length == 0) {
    return <></>
  }

  return <>
    <Text style={styles.title}>{title}</Text>
    <View>
      {/* <TextInput
        placeholder="Search"
        onChangeText={value => searchForItems(value)}
      /> */}
      <View>
        {items.map(item => (
          <TouchableOpacity
            key={item.label}
            onPress={() => { if (canRefine) refine(item.value) }}
            style={styles.item}
          >
            <Text
              style={[
                styles.label,
                item.isRefined && styles.selected,
              ]}
            >
              {item.label}
            </Text>
            <Text style={styles.count}>{item.count}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </>;
}

const styles = StyleSheet.create({
  title: {
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 20
  },
  selected: {
    fontWeight: 'bold',
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
