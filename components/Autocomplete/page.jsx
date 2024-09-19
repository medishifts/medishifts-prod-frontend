/* eslint-disable prettier/prettier */
import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import { animals } from "./data";

export default function App() {
  return (
    <Autocomplete
      className="max-w-xs"
      defaultItems={animals}
      label="Favorite Animal"
      placeholder="Search an animal"
    >
      {(animal) => (
        <AutocompleteItem key={animal.value}>{animal.label}</AutocompleteItem>
      )}
    </Autocomplete>
  );
}
