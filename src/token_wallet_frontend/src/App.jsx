import { useState } from 'react';
import { token_wallet_backend } from 'declarations/token_wallet_backend';

function App() {
  const [greeting, setGreeting] = useState(''); // State to store the greeting message.

  // Handles form submission to call the backend function and update the greeting.
  function handleSubmit(event) {
    event.preventDefault(); // Prevents default form submission behavior (page reload).
    const name = event.target.elements.name.value; // Retrieves the entered name.
    token_wallet_backend.greet(name).then((greeting) => {
      setGreeting(greeting); // Updates the greeting with the backend response.
    });
    return false; // Ensures no additional default behavior occurs.
  }

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" /> {/* Displays the app logo. */}
      <br />
      <br />
      <form action="#" onSubmit={handleSubmit}> {/* Form for input submission. */}
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" /> {/* Text input for the user's name. */}
        <button type="submit">Click Me!</button> {/* Button to submit the form. */}
      </form>
      <section id="greeting">{greeting}</section> {/* Displays the greeting message. */}
    </main>
  );
}

export default App;
