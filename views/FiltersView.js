import { View } from "react-native";
import { CategoriesMenu } from "../components/CategoriesMenu";

export const FiltersView = () => {
  return (
    <View>
      <CategoriesMenu attributes={[
        'hierarchicalCategories.lvl0',
        'hierarchicalCategories.lvl1',
        'hierarchicalCategories.lvl2',
        'hierarchicalCategories.lvl3',
      ]}/>
    </View>
  );
};
