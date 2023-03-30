import { StyleSheet, View } from "react-native";
import { CategoriesMenu } from "./CategoriesMenu";
import { PriceRangePicker } from './PriceRangePicker';
import { RefinementList } from './RefinementList';

export const MyDynamicWidgets = ({ facets }) => {
  // Get all the Available refinements and render them.
  let hierarchicalAdded = false;
  // Array to collect the rendering facets objects.
  const organizedFacets = [
  ];
  // Iterates over active Facets and loads the corresponding React Component
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
          key: `${facetName}`,
          rootPath: null,
        });
      }
    }

    // skuProperties.prices.brlDefault.salePrice case
    else if (facetName === 'skuProperties.prices.brlDefault.salePrice') {
      organizedFacets.push({
        attribute: facetName, type: PriceRangePicker, title: 'Price ($)', key: `${facetName}`
      });
    }
    // skuProperties.prices.ptsDefault.salePrice
    else if (facetName === 'skuProperties.prices.ptsDefault.salePrice') {
      organizedFacets.push({
        attribute: facetName, type: PriceRangePicker, title: 'Price (points)', key: `${facetName}`
      });
    }
    // add more cases
    else if (!facetName.startsWith('skuProperties.hierarchicalCategories')) {
      organizedFacets.push({
        attribute: facetName, type: RefinementList, title: facetName.split('.').pop(), key: `${facetName}-${index}`
      });
    }

  });
  return <View styles='facetsContainer'>
    {organizedFacets.map(facet => {
      const DynamicComponent = facet.type;
      const facetProps = { ...facet };
      delete facetProps.type;
      return <DynamicComponent {...facetProps} />
    })}
  </View>
}


const styles = StyleSheet.create({
  facetsContainer: {
    paddingBottom: 80,
  }
});