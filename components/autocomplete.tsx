/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export const MyAutocomplete = () => {
  const [selectedKey, setSelectedKey] = useState(null);
  const animals = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    // Add more options as needed
  ];

  return (
    <Autocomplete
      label="Favorite Animal, search for one"
      placeholder="Search an animal"
      selectedKey={selectedKey}
      onSelectionChange={(key: any) => setSelectedKey(key)}
    >
      {animals.map((animal) => (
        <AutocompleteItem key={animal.value}>{animal.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default MyAutocomplete;
