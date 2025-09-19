import React from "react";

const TripCard = ({ trip }) => {
  if (!trip) return null;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 my-4 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-1">{trip.title}</h2>
      {trip.date && <p className="text-gray-500 mb-3">{trip.date}</p>}
      {trip.summary && <p className="mb-3 text-gray-700">{trip.summary}</p>}
      {trip.days && trip.days.length > 0 && (
        <div className="mt-2">
          {trip.days.map((day, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="font-semibold text-blue-800 mb-1">
                Day {day.day}
              </h4>
              <ul className="pl-2 list-disc">
                {day.activities.map((act, i) => (
                  <li key={i} className="mb-1">
                    <span className="font-mono text-sm text-gray-600">
                      {act.time}:
                    </span>
                    <span className="ml-2">{act.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripCard;
