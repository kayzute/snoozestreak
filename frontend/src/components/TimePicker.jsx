import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReactDatePicker({ selectedDate, setSelectedDate }) {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      dateFormat="MM/dd/yyyy hh:mm aa"
      placeholderText="Click to select a date"
      showTimeSelect
      timeIntervals={30}
      timeFormat="hh:mm aa"
    />
  );
}
