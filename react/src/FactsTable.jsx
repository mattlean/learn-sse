import { useEffect, useState } from 'react';

export default function FactsTable() {
  const [facts, setFacts] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if(!listening) {
      const events = new EventSource('http://localhost:3000/sse/events');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        setFacts((facts) => facts.concat(parsedData));
      };

      setListening(true);
    }
  }, [facts, listening]);

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Fact</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {
          facts.map((fact, i) =>
            <tr key={i}>
              <td>{fact.info}</td>
              <td>{fact.source}</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}
