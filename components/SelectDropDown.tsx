import React from "react";
import Select from "react-select";


const SelectDropDown = (props: any) => (
  <Select
    isMulti
    options={props?.data || []}
    className="basic-multi-select"
    classNamePrefix="select"
    onChange={(e) => {
      props.onChange(e);
    }}
  />
);

export default SelectDropDown;
