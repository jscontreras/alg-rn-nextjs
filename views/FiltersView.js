import { Dimensions, StyleSheet, ScrollView } from "react-native";
import { CategoriesMenu } from "../components/CategoriesMenu";

export const FiltersView = () => {
  return (
    <ScrollView style={styles.filtersContainer}>
      <CategoriesMenu attributes={[
        'hierarchicalCategories.lvl0',
        'hierarchicalCategories.lvl1',
        'hierarchicalCategories.lvl2',
        'hierarchicalCategories.lvl3',
      ]}/>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  filtersContainer: {
    flexBasis: Dimensions.get('window').height - 180,
    width: '100vw',
    textAlign: 'left',
    paddingHorizontal: 20,
    paddingBottom: 80,
    paddingTop: 30,
    flexGrow: 0,
  }
});