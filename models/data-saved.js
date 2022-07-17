import { backendUrl } from '../environment.js';

class Data {
  constructor(firstValue, firstUnit, secondValue, secondUnit) {
    this.firstValue = firstValue;
    this.firstUnit = firstUnit;
    this.secondValue = secondValue;
    this.secondUnit = secondUnit;
  }

  static async getDataFromDb() {
    try {
      const response = await fetch(`${backendUrl}/saved-conversions`);
      if (response.ok) {
        const responseData = await response.json();
        return responseData;
      } else {
        alert(
          'There was a problem getting the saved conversions. Try again later!'
        );
      }
    } catch (error) {
      alert('Could not send the request. Try again later!');
      console.log(error);
    }
  }
  static async insertDataToDb(data) {
    try {
      const response = await fetch(`${backendUrl}/save-conversion`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const parsedResponse = await response.json();
        return parsedResponse;
      } else {
        alert('There was a problem saving the conversion. Try again later!');
      }
    } catch (error) {
      alert('Could not send the request. Try again later!');
      console.log(error);
    }
  }
  static async deleteSavedSession(sessionId) {
    const id = { id: sessionId };
    try {
      const response = await fetch(`${backendUrl}/delete-session`, {
        method: 'DELETE',
        body: JSON.stringify(id),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        return;
      } else {
        alert('There was a problem removing the conversion. Try again later!');
      }
    } catch (error) {
      alert('Could not send the request. Try again later!');
      console.log(error);
    }
  }
}

export default Data;
