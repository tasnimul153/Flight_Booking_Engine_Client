import React, { useState, useEffect, useRef } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import ReactDatePicker from 'react-datepicker';
import './datePicker.css';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ tag, date, day, active, onSelect }) => {
  const datePickerRef = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Initialize selected date as Date object or null 
  const [selectedDate, setSelectedDate] = useState(new Date(date));

  const handleClick = () => {
    if (!active) { return; }
    setShowCalendar(!showCalendar);
    if (datePickerRef.current) {
      // Trigger the calendar to show up
      const calendarElement = datePickerRef.current.querySelector('.react-datepicker__input-container input');
      if (calendarElement) {
        calendarElement.dispatchEvent(new Event('focus', { bubbles: true, cancelable: true }));
      }
    }
  };

  const handleCalendarClick = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    setSelectedDate(new Date(date));
  }, [date]);
  

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: '2-digit',
    });
    const formattedDay = date.toLocaleDateString('en-US', { weekday: 'long' });
    onSelect(formattedDate, formattedDay);
    setShowCalendar(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const containerClassName = `dateButton mainInput${active ? ' ' : ' DateInactive'}`;

  return (
    <div className={containerClassName} onClick={handleClick} ref={datePickerRef}>
      <div className="dataBox fromDateBox">
        <span className='constant-tag'>{tag} <MdArrowDropDown className="icon" id='dropdownArrow' /></span>
        <span className='date Middle'>{date}</span>
        <span className='day Last'>{day}</span>
      </div>
      {showCalendar && (
        <div onClick={handleCalendarClick}>
          <ReactDatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            monthsShown={2}
            className='calendar'
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;