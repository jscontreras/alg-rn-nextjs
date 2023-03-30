import React, { useState, useEffect } from 'react';
import { useRange } from 'react-instantsearch-hooks';
import { TextInput, View, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';

export const PriceRangePicker = ({attribute, title}) => {
  const rangeProps = useRange({
    attribute: attribute,
  });

  const { range, refine } = rangeProps;
  const [fromPrice, setFromPrice] = useState(range.min);
  const [toPrice, setToPrice] = useState(range.max);


  const handleFromValueChange = (value) => {
    setFromPrice(value);
  };

  const handleToValueChange = (value) => {
    setToPrice(value);
  };

  function handleSetButtonPress() {
    Keyboard.dismiss();
    refine([fromPrice, toPrice])
  }

  useEffect(() => {
    setFromPrice(range.min);
    setToPrice(range.max);
  }, [range.min, range.max]);

  return (
    <View>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.rangeContainer}>
        <TextInput
          keyboardType='numeric'
          style={styles.rangeInput}
          placeholder="From"
          value={`${fromPrice}`}
          onChangeText={handleFromValueChange}
        />
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            keyboardType='numeric'
            style={styles.rangeInput}
            placeholder="To"
            value={`${toPrice}`}
            onChangeText={handleToValueChange}
          />
          <TouchableOpacity
            style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, marginLeft: 5 }}
            onPress={handleSetButtonPress}
          >
            <Text style={{ color: 'white' }}>Set</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18
  },
  rangeContainer: {
    padding: 10,
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeInput: {
    flex:1,
    flexBasis: '30%',
    width: '30%',
    flexGrow: 1,
  }
});
