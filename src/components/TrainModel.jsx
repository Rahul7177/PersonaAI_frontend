import React, { useState } from 'react';
import '../stylesheets/TrainModel.css';
import axios from 'axios';

const TrainModel = () => {
  const questions = [
    { key: 'fullName', question: 'What is your full name?' },
    { key: 'interests', question: 'What are your main interests or hobbies? (comma-separated)' },
    { key: 'dislikes', question: 'What things do you dislike or avoid? (comma-separated)' },
    { key: 'favourites', question: 'List some of your favorite things (books, food, etc) (comma-separated)' },
    { key: 'schedule', question: 'What is your daily schedule? (Enter time and activity)' },
    { key: 'upcomingEvents', question: 'List your upcoming events (name and date)' },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    fullName: '',
    interests: '',
    dislikes: '',
    favourites: '',
    schedule: [{ time: '', activity: '' }],
    upcomingEvents: [{ eventName: '', eventDate: '' }]
  });
  const [showSummary, setShowSummary] = useState(false);

  const handleChange = (e, index = null) => {
    const key = questions[step].key;

    if (key === 'schedule') {
      const newSchedule = [...answers.schedule];
      newSchedule[index][e.target.name] = e.target.value;
      setAnswers({ ...answers, schedule: newSchedule });
    } else if (key === 'upcomingEvents') {
      const newEvents = [...answers.upcomingEvents];
      newEvents[index][e.target.name] = e.target.value;
      setAnswers({ ...answers, upcomingEvents: newEvents });
    } else {
      setAnswers({ ...answers, [key]: e.target.value });
    }
  };

  const handleAddTimeSlot = () => {
    setAnswers({ ...answers, schedule: [...answers.schedule, { time: '', activity: '' }] });
  };

  const handleAddEvent = () => {
    setAnswers({
      ...answers,
      upcomingEvents: [...answers.upcomingEvents, { eventName: '', eventDate: '' }]
    });
  };

  const handleNext = () => {
    if (step === questions.length - 1) {
      setShowSummary(true);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      name: answers.fullName,
      likes: answers.interests.split(',').map(s => s.trim()),
      dislikes: answers.dislikes.split(',').map(s => s.trim()),
      favorites: answers.favourites.split(',').map(s => s.trim()),
      dailySchedule: answers.schedule.map(slot => ({
        date: new Date(),
        events: `${slot.time} - ${slot.activity}`
      })),
      upcomingEvents: answers.upcomingEvents.map(ev => ({
        eventName: ev.eventName,
        eventDate: new Date(ev.eventDate),
        eventDetails: ''
      }))
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/users/updateUserData', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User data saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save user data.');
    }
  };

  return (
    <div className="train-model-container">
      {!showSummary ? (
        <div className="question-card">
          <h2>{questions[step].question}</h2>

          {questions[step].key === 'schedule' ? (
            <div className="schedule-section">
              {answers.schedule.map((slot, idx) => (
                <div key={idx} className="schedule-input">
                  <input
                    type="text"
                    name="time"
                    placeholder="e.g. 9AM - 10AM"
                    value={slot.time}
                    onChange={(e) => handleChange(e, idx)}
                  />
                  <input
                    type="text"
                    name="activity"
                    placeholder="e.g. Study"
                    value={slot.activity}
                    onChange={(e) => handleChange(e, idx)}
                  />
                </div>
              ))}
              <button onClick={handleAddTimeSlot} className="add-slot-btn">+ Add Slot</button>
            </div>
          ) : questions[step].key === 'upcomingEvents' ? (
            <div className="events-section">
              {answers.upcomingEvents.map((event, idx) => (
                <div key={idx} className="event-input">
                  <input
                    type="text"
                    name="eventName"
                    placeholder="Event Name"
                    value={event.eventName}
                    onChange={(e) => handleChange(e, idx)}
                  />
                  <input
                    type="date"
                    name="eventDate"
                    value={event.eventDate}
                    onChange={(e) => handleChange(e, idx)}
                  />
                </div>
              ))}
              <button onClick={handleAddEvent} className="add-slot-btn">+ Add Event</button>
            </div>
          ) : (
            <textarea
              rows="4"
              value={answers[questions[step].key]}
              onChange={handleChange}
              className="text-input"
            />
          )}

          <button className="next-btn" onClick={handleNext}>Next</button>
        </div>
      ) : (
        <div className="summary-card">
          <h2>Review Your Details</h2>
          {questions.map((q, index) => (
            <div key={index} className="summary-item">
              <strong>{q.question}</strong>
              {q.key === 'schedule' ? (
                <ul>
                  {answers.schedule.map((slot, i) => (
                    <li key={i}>{slot.time} - {slot.activity}</li>
                  ))}
                </ul>
              ) : q.key === 'upcomingEvents' ? (
                <ul>
                  {answers.upcomingEvents.map((ev, i) => (
                    <li key={i}>{ev.eventName} on {ev.eventDate}</li>
                  ))}
                </ul>
              ) : (
                <p>{answers[q.key]}</p>
              )}
            </div>
          ))}
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default TrainModel;
